# === Import libraries ===
import sqlite3 as sql
import pandas as pd
import numpy
import matplotlib
import scipy
import sklearn

from pandas.plotting import scatter_matrix
from matplotlib import pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# === Helper: Convert shift time "HH:MM" string to float ===
def time_to_float(t):
    h, m = map(int, t.split(':'))
    return h + m / 60

# === Connect to SQLite database ===
conn = sql.connect('C:\\Users\\shael\\sandbox\\SandboxProject\\db.sqlite')

# === Load dataset ===
query = "SELECT * FROM historical_schedules"
dataset = pd.read_sql_query(query, conn)
print("\n=== First Rows of Data ===")
print(dataset.head())

# === Preprocessing ===
dataset['shift_start'] = dataset['shift_start'].apply(lambda x: time_to_float(x) if pd.notnull(x) else 0)
dataset['shift_end'] = dataset['shift_end'].apply(lambda x: time_to_float(x) if pd.notnull(x) else 0)

# Encode availability
dataset['employee_availability'] = dataset['employee_availability'].map({'Available': 1, 'Unavailable': 0})
dataset['employee_availability'] = dataset['employee_availability'].fillna(0)

# Handle missing roles
dataset['employee_role'] = dataset['employee_role'].fillna('Unknown')
dataset['business_need_role'] = dataset['business_need_role'].fillna('Unknown')

# Encode roles
role_encoder = LabelEncoder()
dataset['employee_role'] = role_encoder.fit_transform(dataset['employee_role'])
dataset['business_need_role'] = role_encoder.fit_transform(dataset['business_need_role'])

# Fill missing counts
dataset['business_need_count'] = dataset['business_need_count'].fillna(1)

# Drop rows where the label is missing
dataset = dataset.dropna(subset=['was_scheduled'])

# Prepare inputs (X) and outputs (y)
X = dataset[['shift_start', 'shift_end', 'employee_availability', 'employee_role', 'business_need_role', 'business_need_count']]
y = dataset['was_scheduled']

# Scale numeric features
scaler = MinMaxScaler()
X.loc[:, ['shift_start', 'shift_end', 'business_need_count']] = scaler.fit_transform(
    X[['shift_start', 'shift_end', 'business_need_count']]
)

# === Train/Test split ===
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1, stratify=y)

# === Smart n_splits Setup ===
# Find smallest class count
min_class_count = y_train.value_counts().min()

# Pick a reasonable n_splits
if min_class_count >= 10:
    n_splits = 10
elif min_class_count >= 5:
    n_splits = 5
else:
    n_splits = 3

print(f"\nUsing n_splits = {n_splits} for StratifiedKFold (based on data size)")

# === Model Setup ===
models = [
    ('LR', LogisticRegression(max_iter=500)),
    ('CART', DecisionTreeClassifier()),
    ('NB', GaussianNB()),
    ('SVM', SVC())
]

# === Cross-Validation ===
print("\n=== Cross-Validation Results ===")
for name, model in models:
    kfold = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=1)
    cv_results = cross_val_score(model, X_train, y_train, cv=kfold, scoring='accuracy')
    print(f"{name}: {cv_results.mean():.4f} ({cv_results.std():.4f})")

# === Shift Scheduling Health Check ===
scheduled_summary = dataset.groupby(['date', 'shift_start', 'shift_end']).agg(
    total_scheduled=('was_scheduled', 'sum'),
    business_need=('business_need_count', 'first')
).reset_index()

# Determine shift status
scheduled_summary['shift_status'] = scheduled_summary.apply(
    lambda row: (
        'Perfect' if row['total_scheduled'] == row['business_need']
        else ('Understaffed' if row['total_scheduled'] < row['business_need']
              else 'Overstaffed')
    ), axis=1
)

# Print Health Check
print("\n=== Shift Scheduling Health Check ===")
print(scheduled_summary)

# Save shift health to CSV
scheduled_summary.to_csv('shift_health_check.csv', index=False)

# === Plot Shift Status (colored bar chart) ===
colors = {
    'Perfect': 'green',
    'Understaffed': 'orange',
    'Overstaffed': 'red'
}

status_counts = scheduled_summary['shift_status'].value_counts()

plt.figure(figsize=(8, 6))
plt.bar(
    status_counts.index,
    status_counts.values,
    color=[colors.get(status, 'grey') for status in status_counts.index]
)
plt.title('Shift Scheduling Status')
plt.xlabel('Shift Status')
plt.ylabel('Number of Shifts')
plt.grid(axis='y')
plt.show()

# === Rank Worst Shifts ===
scheduled_summary['staffing_gap'] = scheduled_summary['total_scheduled'] - scheduled_summary['business_need']

worst_shifts = scheduled_summary.sort_values(by='staffing_gap')

print("\n=== Worst Shifts (Most Understaffed or Overstaffed) ===")
print(worst_shifts[['date', 'shift_start', 'shift_end', 'total_scheduled', 'business_need', 'staffing_gap', 'shift_status']])

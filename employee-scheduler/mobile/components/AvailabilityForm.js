import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';

const AvailabilityForm = ({ employeeId, onSubmit, onCancel, loading }) => {
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = () => {
        if (!dayOfWeek.trim()) {
            Alert.alert('Error', 'Day of week is required');
            return;
        }
        if (!startTime.trim() || !endTime.trim()) {
            Alert.alert('Error', 'Start time and end time are required');
            return;
        }
        if (endTime <= startTime) {
            Alert.alert('Error', 'End time must be after start time');
            return;
        }
        onSubmit({ day_of_week: dayOfWeek, start_time: startTime, end_time: endTime, employee_id: employeeId });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Add Availability</Text>
                <TouchableOpacity onPress={onCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Day of Week</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Monday"
                    value={dayOfWeek}
                    onChangeText={setDayOfWeek}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={startTime}
                    onChangeText={setStartTime}
                    keyboardType="default"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={endTime}
                    onChangeText={setEndTime}
                    keyboardType="default"
                />
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" />
                ) : (
                    <Text style={styles.submitButtonText}>Save Availability</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cancelText: {
        color: '#666',
        fontSize: 14,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AvailabilityForm;
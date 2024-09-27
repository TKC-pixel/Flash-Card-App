import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../components/firebase'; 
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

export default function FlashCard({ route, navigation }) {
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState('');
    const [color, setColor] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Not Complete');
    const [editId, setEditId] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const userDoc = doc(db, 'users', userId);
                const docSnap = await getDoc(userDoc);
                
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserName(userData.firstName);
                }
            }
        };

        fetchUserName();

        if (route.params?.card) {
            const { card } = route.params;
            setTitle(card.title);
            setTasks(card.tasks);
            setColor(card.color);
            setDueDate(card.dueDate);
            setStatus(card.status);
            setEditId(card.id);
        }
    }, [route.params]);

    const addCard = async () => {
        if (title && tasks) {
            await addDoc(collection(db, 'flashcards'), { title, tasks, color, dueDate, status });
            clearInputs();
            navigation.navigate('Cards');
        } else {
            Alert.alert("Please fill out the title and tasks.");
        }
    };

    const updateCard = async () => {
        if (editId) {
            await updateDoc(doc(db, 'flashcards', editId), { title, tasks, color, dueDate, status });
            clearInputs();
            navigation.navigate('Cards');
        }
    };

    const clearInputs = () => {
        setTitle('');
        setTasks('');
        setColor('');
        setDueDate('');
        setStatus('Not Complete');
        setEditId(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greeting}>Hi {userName}</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.tasks}
                placeholder="Tasks"
                value={tasks}
                onChangeText={setTasks}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />
            <TextInput
                style={styles.input}
                placeholder="Color"
                value={color}
                onChangeText={setColor}
            />
            <TextInput
                style={styles.input}
                placeholder="Due Date: DD/MM/YYYY"
                value={dueDate}
                onChangeText={setDueDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Status"
                value={status}
                onChangeText={setStatus}
            />
            <TouchableOpacity style={styles.button} onPress={editId ? updateCard : addCard}>
                <Text style={styles.buttonText}>{editId ? 'Update Flashcard' : 'Add Flashcard'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e5eff1',
        justifyContent: 'flex-start',
    },
    greeting: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    input: {
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    tasks: {
        height: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

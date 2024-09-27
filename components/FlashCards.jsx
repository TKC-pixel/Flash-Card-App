import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { db } from '../components/firebase'; 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Loading from '../assets/loading-gif-icon-24.jpg';

export default function Cards({ navigation }) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true); 

    const fetchCards = async () => {
        setLoading(true); 
        try {
            const snapshot = await getDocs(collection(db, 'flashcards'));
            const cardData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCards(cardData); 
        } catch (error) {
            Alert.alert("Error fetching cards", error.message);
        } finally {
            setLoading(false); 
        }
    };

    const deleteCard = async (id) => {
        await deleteDoc(doc(db, 'flashcards', id));
        fetchCards(); 
    };

    useEffect(() => {
        const reload = navigation.addListener('focus', () => {
            fetchCards(); 
        });

        return reload; 
    }, [navigation]);

    const renderCard = ({ item }) => (
        <View style={[styles.card, { backgroundColor: item.color || '#fff' }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
            </View>
            <Text>{item.tasks}</Text>
            <Text>Status: {item.status}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FlashCards', { card: item })}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => deleteCard(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleRefresh = () => {
        fetchCards(); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('FlashCards')}>
                <Text style={styles.addButtonText}>Add Flashcard</Text>
            </TouchableOpacity>
            
            {loading ? ( 
                <View style={styles.loadingContainer}>
                    <Image source={Loading} style={styles.loadingImage} />
                    <Text>Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    refreshing={loading}
                    onRefresh={handleRefresh} 
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#e5eff1',
    },
    card: {
        width: '100%',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        shadowColor: '#000', 
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    dueDate: {
        color: 'red',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5, 
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    loadingImage: {
        width: 400, 
        height: 400, 
        marginBottom: 10,
    },
});

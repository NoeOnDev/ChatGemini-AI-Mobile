import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContent: {
        padding: 10,
    },
    messageContainer: {
        marginBottom: 10,
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
    },
    userMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    botMessage: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
    },
    userText: {
        fontSize: 15,
        color: '#000',
    },
    botText: {
        fontSize: 15,
        color: '#555',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    textInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        color: '#333',
    },
});

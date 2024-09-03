import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-native-markdown-display';
import { styles } from './AppStyles';
import { API_KEY } from '@env';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const chat = model.startChat();

interface Message {
  question: string;
  answer: string;
}

const useChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessageToAI = async (query: string, context: Message[]) => {
    const contextMessages = context
      .map((msg) => `Q: ${msg.question}\n${msg.answer}`)
      .join('\n');
    const fullQuery = `${contextMessages}\nQ: ${query}`;

    const result = await chat.sendMessage(fullQuery);
    return result.response?.text();
  };

  const handleSend = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        Alert.alert('Error', 'The query cannot be empty.');
        return;
      }

      const newQuestion: Message = { question: query, answer: '' };
      setMessages((prevMessages) => [...prevMessages, newQuestion]);
      setIsLoading(true);

      try {
        const text = await sendMessageToAI(query, messages);
        if (text) {
          setMessages((prevMessages) =>
            prevMessages.map((msg, index) =>
              index === prevMessages.length - 1
                ? { ...msg, answer: text }
                : msg
            )
          );
        }
      } catch (err) {
        Alert.alert('Error', (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    handleSend,
  };
};

function App() {
  const [query, setQuery] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, handleSend } = useChatLogic();

  const onSendPress = () => {
    handleSend(query);
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View>
            <View style={[styles.messageContainer, styles.userMessage]}>
              <Text style={styles.userText}>{item.question}</Text>
            </View>
            {item.answer ? (
              <View style={[styles.messageContainer, styles.botMessage]}>
                <Markdown
                  style={{
                    body: styles.botText,
                    text: styles.botText,
                  }}
                >
                  {item.answer}
                </Markdown>
              </View>
            ) : null}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Type your question here..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity activeOpacity={0.7} onPress={onSendPress} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Icon name="send" size={28} color="#007AFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default App;

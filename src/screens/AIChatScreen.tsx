// @ts-nocheck
// @ts-nocheck
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme, Typography } from '../theme/AppTheme';
import { GlassCard } from '../shared/components/CommonWidgets';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: "Hello Alex! I'm MediAI. How can I help you with your health today?", isBot: true },
];

const QUICK_REPLIES = [
  "What does my BP mean?",
  "I have a headache.",
  "Schedule checkup",
  "Review my meds"
];

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate Bot Response
    setTimeout(() => {
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "I understand. Let me check your medical records to provide a better recommendation.", 
        isBot: true 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
    return (
      <View style={[styles.messageRow, item.isBot ? styles.messageRowBot : styles.messageRowUser]}>
        {item.isBot && (
          <View style={styles.botAvatar}>
            <Ionicons name="medical" color={AppTheme.bgDeep} size={14} />
          </View>
        )}
        
        {item.isBot ? (
          <View style={[styles.bubble, styles.bubbleBot]}>
            <Text style={[Typography.body, { color: AppTheme.textPrimary }]}>{item.text}</Text>
          </View>
        ) : (
          <LinearGradient
            colors={AppTheme.primaryGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.bubbleUser]}
          >
            <Text style={[Typography.body, { color: AppTheme.bgDeep, fontWeight: '500' }]}>{item.text}</Text>
          </LinearGradient>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={Typography.h1}>MediAI Assistant</Text>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            isTyping ? (
              <View style={styles.typingContainer}>
                <View style={styles.botAvatar}>
                  <Ionicons name="medical" color={AppTheme.bgDeep} size={14} />
                </View>
                <GlassCard padding={12} style={{ width: 80, marginLeft: 8 }}>
                  <View style={styles.typingDots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </GlassCard>
              </View>
            ) : null
          )}
        />

        {/* Input Area */}
        <View style={styles.inputArea}>
          {/* Quick Replies */}
          <View style={styles.quickRepliesContainer}>
            <FlatList
              horizontal
              data={QUICK_REPLIES}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => sendMessage(item)} style={styles.quickReplyBtn}>
                  <Text style={[Typography.caption, { color: AppTheme.teal }]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Text Input */}
          <View style={styles.inputRow}>
            <View style={styles.textInputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor={AppTheme.textMuted}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => sendMessage(input)}
              />
            </View>
            <TouchableOpacity 
              onPress={() => sendMessage(input)} 
              disabled={!input.trim()}
              style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.5 }]}
            >
              <LinearGradient
                colors={AppTheme.primaryGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.sendBtnGradient}
              >
                <Ionicons name="send" color={AppTheme.bgDeep} size={16} style={{ marginLeft: 2 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.bgDeep,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
  },
  chatList: {
    padding: 20,
    paddingBottom: 40, // for bottom tabs spacing if needed
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppTheme.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleBot: {
    backgroundColor: AppTheme.surface,
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingDots: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppTheme.textMuted,
  },
  inputArea: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 100 : 100, // Extra padding for bottom tabs
    backgroundColor: AppTheme.bgCard,
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
  },
  quickRepliesContainer: {
    marginBottom: 12,
  },
  quickReplyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: `${AppTheme.teal}1A`,
    borderWidth: 1,
    borderColor: `${AppTheme.teal}33`,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: AppTheme.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppTheme.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  textInput: {
    color: AppTheme.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sendBtnGradient: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


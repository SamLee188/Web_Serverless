const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL and Anon Key are required in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
    constructor() {
        this.tableName = 'Conver_Serverless';
    }

    // Generate a unique conversation ID
    generateConversationId() {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Save a new conversation
    async saveConversation(sessionId, messages) {
        try {
            const conversationId = this.generateConversationId();
            
            const { data, error } = await supabase
                .from(this.tableName)
                .insert([
                    {
                        conversation_id: conversationId,
                        messages: messages
                    }
                ])
                .select();

            if (error) {
                console.error('❌ Error saving conversation to Supabase:', error);
                throw error;
            }

            console.log('✅ Conversation saved to Supabase:', conversationId);
            return {
                conversationId,
                data: data[0]
            };
        } catch (error) {
            console.error('❌ Failed to save conversation:', error);
            throw error;
        }
    }

    // Update an existing conversation
    async updateConversation(conversationId, messages) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ messages: messages })
                .eq('conversation_id', conversationId)
                .select();

            if (error) {
                console.error('❌ Error updating conversation in Supabase:', error);
                throw error;
            }

            console.log('✅ Conversation updated in Supabase:', conversationId);
            return data[0];
        } catch (error) {
            console.error('❌ Failed to update conversation:', error);
            throw error;
        }
    }

    // Get a conversation by ID
    async getConversation(conversationId) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('conversation_id', conversationId)
                .single();

            if (error) {
                console.error('❌ Error fetching conversation from Supabase:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Failed to get conversation:', error);
            throw error;
        }
    }

    // Get all conversations
    async getAllConversations() {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error fetching conversations from Supabase:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('❌ Failed to get conversations:', error);
            throw error;
        }
    }

    // Delete a conversation
    async deleteConversation(conversationId) {
        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('conversation_id', conversationId);

            if (error) {
                console.error('❌ Error deleting conversation from Supabase:', error);
                throw error;
            }

            console.log('✅ Conversation deleted from Supabase:', conversationId);
            return true;
        } catch (error) {
            console.error('❌ Failed to delete conversation:', error);
            throw error;
        }
    }

    // Get conversation statistics
    async getConversationStats() {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*');

            if (error) {
                console.error('❌ Error fetching conversation stats from Supabase:', error);
                throw error;
            }

            const totalConversations = data.length;
            const totalMessages = data.reduce((sum, conv) => {
                return sum + (conv.messages ? conv.messages.length : 0);
            }, 0);

            return {
                totalConversations,
                totalMessages,
                activeSessions: totalConversations // For now, all conversations are considered active
            };
        } catch (error) {
            console.error('❌ Failed to get conversation stats:', error);
            throw error;
        }
    }

    // Test database connection
    async testConnection() {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('count')
                .limit(1);

            if (error) {
                console.error('❌ Supabase connection test failed:', error);
                return false;
            }

            console.log('✅ Supabase connection successful');
            return true;
        } catch (error) {
            console.error('❌ Supabase connection test failed:', error);
            return false;
        }
    }
}

module.exports = new SupabaseService(); 
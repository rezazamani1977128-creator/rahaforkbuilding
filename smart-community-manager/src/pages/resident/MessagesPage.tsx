import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender: 'user' | 'manager';
  name: string;
  role: string;
  avatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'manager',
      name: 'احمد رضایی',
      role: 'مدیر ساختمان',
      avatar: 'ا.ر',
      content: 'سلام، شارژ این ماه ثبت شده. لطفاً تا تاریخ ۲۰ پرداخت فرمایید.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '2',
      sender: 'user',
      name: 'شما',
      role: 'ساکن',
      avatar: 'ش',
      content: 'سلام، بسیار متشکرم. من فردا پرداخت خواهم کرد.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Math.random().toString(),
        sender: 'user',
        name: 'شما',
        role: 'ساکن',
        avatar: 'ش',
        content: messageInput,
        timestamp: new Date(),
        read: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">پیام‌ها</h1>
        <p className="text-muted-foreground mt-1">
          ارتباط مستقیم با مدیر ساختمان
        </p>
      </div>

      {/* Messages Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            گفتگو با مدیر
          </CardTitle>
          <CardDescription>
            مدیر ساختمان: احمد رضایی
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages List */}
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={message.sender === 'manager' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${message.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                  <div className="text-sm font-medium">{message.name}</div>
                  <div className={`mt-1 max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'manager'
                      ? 'bg-primary/10 text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="پیام خود را بنویسید..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="resize-none min-h-20"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 راه‌های تماس سریع:
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 mt-2 space-y-1">
              <li>📞 تلفن: <span dir="ltr" className="font-mono">0912-123-4567</span></li>
              <li>📧 ایمیل: <span dir="ltr" className="font-mono">manager@building.com</span></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

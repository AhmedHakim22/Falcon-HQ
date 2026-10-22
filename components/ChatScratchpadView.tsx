'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Lightbulb, 
  CheckSquare, 
  Sparkles, 
  User, 
  Trash2,
  MessageSquare
} from 'lucide-react';
import { ChatThought } from '@/lib/types';

interface ChatScratchpadViewProps {
  thoughts: ChatThought[];
  onAddThought: (thought: Omit<ChatThought, 'id' | 'createdAt'>) => void;
  onConvertToIdea: (thought: ChatThought) => void;
  onConvertToTask: (thought: ChatThought) => void;
  onDeleteThought: (id: string) => void;
  currentUser: string;
}

export function ChatScratchpadView({
  thoughts,
  onAddThought,
  onConvertToIdea,
  onConvertToTask,
  onDeleteThought,
  currentUser,
}: ChatScratchpadViewProps) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  // Handle Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        clearInterval(timerRef.current);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          onAddThought({
            sender: currentUser as any,
            audioBase64: reader.result as string,
            audioDuration: recordingSeconds || 1,
          });
          setRecordingSeconds(0);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone error:', err);
      alert('يرجى السماح بالوصول للميكروفون لتسجيل الملاحظات الصوتية.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onAddThought({
      sender: currentUser as any,
      text: inputText.trim(),
    });

    setInputText('');
  };

  const handleTogglePlayAudio = (id: string, base64: string) => {
    if (playingAudioId === id) {
      audioElementRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      const audio = new Audio(base64);
      audioElementRef.current = audio;
      audio.onended = () => setPlayingAudioId(null);
      audio.play();
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-stone-900 rounded-3xl border border-sand-border dark:border-stone-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-sand-border dark:border-stone-800 flex items-center justify-between bg-sand-50/70 dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-charcoal dark:text-stone-100 flex items-center gap-2">
              <span>شات الأفكار والمسودات الحرة</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 dark:bg-stone-800 text-charcoal-muted dark:text-stone-300">
                {thoughts.length} مسودة
              </span>
            </h2>
            <p className="text-xs text-charcoal-muted dark:text-stone-400">
              ارمِ أي فكرة سريعة أو تسجيل صوتي أنت ومعاذ وحولها لفكرة رسمية أو مهمة بنقرة واحدة
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-falcon-50 dark:bg-falcon-950/60 text-falcon-600 border border-falcon-200 dark:border-falcon-900">
          تتحدث باسم: {currentUser}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-sand-100/50 dark:bg-stone-950/40">
        {thoughts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 rounded-3xl bg-sand-200 dark:bg-stone-800 flex items-center justify-center text-charcoal-muted mb-3">
              <Sparkles className="w-7 h-7 text-falcon-600" />
            </div>
            <h3 className="text-sm font-bold text-charcoal dark:text-stone-200">
              المساحة الحرة فارغة تماماً
            </h3>
            <p className="text-xs text-charcoal-muted dark:text-stone-400 max-w-sm mt-1">
              اكتب خاطرة أو سجل فويس نوت وأنت في الطريق، وستجدها هنا محفوظة ومتاحة للتحويل لأي سكريبت أو مهمة.
            </p>
          </div>
        ) : (
          thoughts.map((item) => {
            const isMe = item.sender === currentUser;
            return (
              <div
                key={item.id}
                className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                  isMe ? 'mr-auto items-end' : 'ml-auto items-start'
                }`}
              >
                {/* Sender Pill */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-charcoal-muted dark:text-stone-400 mb-1 px-1">
                  <span>{item.sender}</span>
                  <span className="text-[10px] font-normal text-stone-400">
                    {new Date(item.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`p-4 rounded-3xl shadow-xs transition-all relative group ${
                    isMe
                      ? 'bg-falcon-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-stone-800 text-charcoal dark:text-stone-100 rounded-tl-sm border border-sand-border dark:border-stone-700'
                  }`}
                >
                  {/* Text Message */}
                  {item.text && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {item.text}
                    </p>
                  )}

                  {/* Audio Memo */}
                  {item.audioBase64 && (
                    <div className="flex items-center gap-3 py-1 min-w-[200px]">
                      <button
                        onClick={() => handleTogglePlayAudio(item.id, item.audioBase64!)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isMe
                            ? 'bg-white text-falcon-600 hover:scale-105'
                            : 'bg-falcon-600 text-white hover:scale-105'
                        }`}
                      >
                        {playingAudioId === item.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 mr-0.5" />
                        )}
                      </button>
                      <div>
                        <p className={`text-xs font-bold ${isMe ? 'text-white' : 'text-charcoal dark:text-stone-100'}`}>
                          تسجيل صوتي
                        </p>
                        <p className={`text-[10px] ${isMe ? 'text-falcon-100' : 'text-charcoal-muted dark:text-stone-400'}`}>
                          {item.audioDuration ? `${item.audioDuration} ثانية` : 'ملاحظة صوتية'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Converted indicator */}
                  {item.convertedTo && (
                    <div className="mt-2 pt-2 border-t border-white/20 dark:border-stone-700/60 text-[10px] font-bold text-amber-200 dark:text-amber-400">
                      ✓ تم تحويلها إلى {item.convertedTo.type === 'idea' ? 'فكرة' : 'مهمة'}: {item.convertedTo.title}
                    </div>
                  )}

                  {/* Action Bar (Convert to Idea or Task) */}
                  <div className={`mt-3 pt-2 border-t flex flex-wrap items-center gap-1.5 text-xs ${
                    isMe ? 'border-white/20' : 'border-sand-border dark:border-stone-700'
                  }`}>
                    <button
                      onClick={() => onConvertToIdea(item)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                        isMe
                          ? 'bg-white/20 hover:bg-white/30 text-white'
                          : 'bg-sand-100 dark:bg-stone-700 hover:bg-sand-200 text-charcoal dark:text-stone-200'
                      }`}
                      title="تحويل إلى فكرة في بنك الأفكار"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>فكرة 💡</span>
                    </button>

                    <button
                      onClick={() => onConvertToTask(item)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                        isMe
                          ? 'bg-white/20 hover:bg-white/30 text-white'
                          : 'bg-sand-100 dark:bg-stone-700 hover:bg-sand-200 text-charcoal dark:text-stone-200'
                      }`}
                      title="تحويل إلى مهمة في قائمة التشغيل"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>مهمة 📋</span>
                    </button>

                    <button
                      onClick={() => onDeleteThought(item.id)}
                      className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ml-auto ${
                        isMe ? 'text-white/70 hover:text-white' : 'text-stone-400 hover:text-red-500'
                      }`}
                      title="حذف المسودة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar with Voice & Send Buttons */}
      <div className="p-3 sm:p-4 bg-white dark:bg-stone-900 border-t border-sand-border dark:border-stone-800">
        <form onSubmit={handleSendText} className="flex items-center gap-2">
          {/* Voice Recorder Button */}
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="w-11 h-11 rounded-2xl bg-sand-100 hover:bg-sand-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-falcon-600 flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
              title="تسجيل صوتي"
            >
              <Mic className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 h-11 rounded-2xl bg-red-600 text-white font-bold text-xs animate-pulse transition-transform active:scale-95 flex-shrink-0"
              title="إيقاف التسجيل وإرساله"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>إيقاف ({recordingSeconds}s)</span>
            </button>
          )}

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecording}
            placeholder={isRecording ? 'جاري التسجيل الصوتي...' : 'اكتب فكرة سريعة أو فويس نوت...'}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-sand-50 dark:bg-stone-800 border border-sand-border dark:border-stone-700 text-charcoal dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-falcon-500 disabled:opacity-50 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isRecording}
            className="w-11 h-11 rounded-2xl bg-falcon-600 hover:bg-falcon-700 disabled:opacity-40 text-white flex items-center justify-center transition-transform active:scale-95 flex-shrink-0 shadow-md shadow-falcon-600/20"
            title="إرسال"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
}

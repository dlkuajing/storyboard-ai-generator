'use client';

import { useState, useEffect } from 'react';
import { Storyboard, GenerateRequest } from '@/lib/types';
import ShotCard from '@/components/ShotCard';
import ViralStrategy from '@/components/ViralStrategy';
import { 
  Film, Loader2, Download, Send, Sparkles, 
  Settings, Wand2, FileText, Layers, 
  ChevronRight, Info, Zap, BookOpen,
  Target, Clock, Users, Copy, Check
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [script, setScript] = useState('');
  const [style, setStyle] = useState<GenerateRequest['style']>('dramatic');
  const [platform, setPlatform] = useState<GenerateRequest['platform']>('douyin');
  const [targetDuration, setTargetDuration] = useState(60);
  const [targetAudience, setTargetAudience] = useState('年轻人群体');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [copied, setCopied] = useState(false);

  // 预设模板
  const templates = [
    { name: '产品推广', script: '这是一款革命性的产品，它将改变你的生活方式...', audience: '25-40岁职场人士' },
    { name: '知识科普', script: '今天给大家分享一个有趣的科学知识...', audience: '18-35岁知识爱好者' },
    { name: '情感故事', script: '那一年的夏天，我遇见了改变我一生的人...', audience: '20-30岁文艺青年' },
  ];

  // 监听快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && script.trim() && !loading) {
        handleGenerate();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [script, loading]);

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error('请输入旁白文案');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          style,
          platform,
          targetDuration,
          targetAudience,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStoryboard(data.storyboard);
        toast.success('分镜脚本生成成功！', {
          icon: '🎬',
          duration: 3000,
        });
      } else {
        toast.error(data.error || '生成失败，请重试');
      }
    } catch (error) {
      toast.error('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToNotion = async () => {
    if (!storyboard) return;

    setExporting(true);
    try {
      const response = await fetch('/api/export-notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyboard }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('成功导出到Notion！', {
          icon: '📝',
          duration: 3000,
        });
      } else {
        toast.error(data.error || '导出失败，请重试');
      }
    } catch (error) {
      toast.error('导出错误，请检查Notion配置');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyScript = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success('文案已复制');
    setTimeout(() => setCopied(false), 2000);
  };

  const loadTemplate = (template: typeof templates[0]) => {
    setScript(template.script);
    setTargetAudience(template.audience);
    toast.success(`已加载${template.name}模板`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            color: '#1f2937',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
        }}
      />
      
      {/* 顶部标题区域 */}
      <div className="w-full py-12 text-center bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            跨海帆-速分镜
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-gray-600 text-lg">基于AI的短视频分镜创作工具</p>
        <p className="text-gray-500 mt-2">融合病毒营销策略，快速生成专业分镜脚本</p>
      </div>

      {/* 主内容区域 */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* 快速模板 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              快速模板
            </h3>
            <div className="flex gap-3">
              {templates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => loadTemplate(template)}
                  className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* 旁白文案输入 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              旁白文案
            </h3>
            
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value.slice(0, 500))}
              placeholder="输入你的短视频旁白内容..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{script.length}/500</span>
                <button
                  onClick={handleCopyScript}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="复制文案"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                提示：按 Ctrl/Cmd + Enter 快速生成
              </div>
            </div>
          </div>

          {/* 创作设置区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 风格类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Layers className="w-4 h-4 text-purple-500" />
                风格类型
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as GenerateRequest['style'])}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="dramatic">🎭 剧情片</option>
                <option value="comedy">😄 喜剧</option>
                <option value="documentary">📹 纪录片</option>
                <option value="commercial">💼 商业广告</option>
                <option value="educational">📚 教育科普</option>
              </select>
            </div>

            {/* 投放平台 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Target className="w-4 h-4 text-purple-500" />
                投放平台
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GenerateRequest['platform'])}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="douyin">🎵 抖音</option>
                <option value="xiaohongshu">📖 小红书</option>
                <option value="youtube">▶️ YouTube</option>
                <option value="bilibili">📺 B站</option>
              </select>
            </div>

            {/* 目标时长 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-500" />
                目标时长
              </label>
              <div className="relative">
                <input
                  type="range"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(Number(e.target.value))}
                  min="15"
                  max="300"
                  step="15"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(targetDuration - 15) / 285 * 100}%, #e5e7eb ${(targetDuration - 15) / 285 * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="text-center mt-2">
                  <span className="text-lg font-semibold text-purple-600">{targetDuration}秒</span>
                </div>
              </div>
            </div>

            {/* 目标受众 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Users className="w-4 h-4 text-purple-500" />
                目标受众
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="如：18-25岁年轻人"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={loading || !script.trim()}
            className={`
              w-full py-4 rounded-xl font-semibold text-white text-lg
              bg-gradient-to-r from-purple-600 to-pink-600
              transition-all duration-300 transform
              flex items-center justify-center gap-2
              ${loading || !script.trim() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl'}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI分析中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>生成分镜</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* 底部提示 */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-700">
                AI将自动分析文案，生成专业分镜脚本，包含画面描述、镜头运动和营销策略点
              </p>
            </div>
          </div>
        </div>

        {/* 结果展示区域 */}
        {storyboard && (
          <div className="mt-8">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* 头部信息 */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {storyboard.title}
                  </h2>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                      <Clock className="w-3 h-3" />
                      总时长: {storyboard.totalDuration}秒
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      <Layers className="w-3 h-3" />
                      共{storyboard.shots.length}个镜头
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleExportToNotion}
                  disabled={exporting}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  导出到Notion
                </button>
              </div>

              {/* 完整文案展示 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 mb-8">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  完整旁白文案
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {storyboard.script}
                </p>
              </div>

              {/* 病毒营销策略 */}
              <ViralStrategy strategy={storyboard.viralStrategy} />
              
              {/* 分镜详情 */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <Film className="w-6 h-6 text-purple-600" />
                  分镜详情
                </h3>
                
                <div className="space-y-6">
                  {storyboard.shots.map((shot, index) => (
                    <ShotCard key={shot.id} shot={shot} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
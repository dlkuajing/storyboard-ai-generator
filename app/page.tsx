'use client';

import { useState } from 'react';
import { Storyboard, GenerateRequest } from '@/lib/types';
import ShotCard from '@/components/ShotCard';
import ViralStrategy from '@/components/ViralStrategy';
import { Film, Loader2, Download, Send, Sparkles } from 'lucide-react';
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

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.error('请输入文案内容');
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
        toast.success('分镜脚本生成成功！');
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
        toast.success('成功导出到Notion！');
      } else {
        toast.error(data.error || '导出失败，请重试');
      }
    } catch (error) {
      toast.error('导出错误，请检查Notion配置');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              智能分镜脚本生成器
            </h1>
          </div>
          <p className="text-gray-600">基于AI的短视频分镜创作工具，融合病毒营销策略</p>
          <p className="text-sm text-gray-500 mt-2">输入旁白文案，AI将自动分配到各镜头并设计对应画面</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                创作设置
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    旁白文案
                  </label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="输入你的短视频旁白内容..."
                    className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    风格类型
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as GenerateRequest['style'])}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="dramatic">剧情片</option>
                    <option value="comedy">喜剧</option>
                    <option value="documentary">纪录片</option>
                    <option value="commercial">商业广告</option>
                    <option value="educational">教育科普</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    投放平台
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as GenerateRequest['platform'])}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="douyin">抖音</option>
                    <option value="xiaohongshu">小红书</option>
                    <option value="youtube">YouTube</option>
                    <option value="bilibili">B站</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标时长（秒）
                  </label>
                  <input
                    type="number"
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(Number(e.target.value))}
                    min="15"
                    max="300"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标受众
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="如：18-25岁年轻人"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !script.trim()}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      生成分镜
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {storyboard ? (
              <div>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {storyboard.title}
                      </h2>
                      <p className="text-gray-600">
                        总时长: {storyboard.totalDuration}秒 | 
                        共{storyboard.shots.length}个镜头
                      </p>
                    </div>
                    <button
                      onClick={handleExportToNotion}
                      disabled={exporting}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center gap-2"
                    >
                      {exporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      导出到Notion
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">完整旁白文案</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{storyboard.script}</p>
                  </div>
                </div>

                <ViralStrategy strategy={storyboard.viralStrategy} />

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">分镜详情</h3>
                  <div className="space-y-6">
                    {storyboard.shots.map((shot, index) => (
                      <ShotCard key={shot.id} shot={shot} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  开始创作你的分镜脚本
                </h3>
                <p className="text-gray-500">
                  输入文案内容，AI将为你生成专业的分镜脚本
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
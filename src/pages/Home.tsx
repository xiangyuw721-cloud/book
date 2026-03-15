import { useState } from 'react';
import { BookOpen, Copy, Check, Loader2 } from 'lucide-react';

export default function Home() {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (mode: 'full' | 'partial') => {
    if (!bookName.trim()) {
      alert('请输入书名');
      return;
    }

    setLoading(true);
    setContent('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookName,
          author,
          experience,
          mode,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setContent(data.content);
      }
    } catch (error) {
      console.error(error);
      alert('生成失败，请检查网络或重试');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-stone-800 rounded-full text-amber-50 mb-4 shadow-lg">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            读书分享生成器
          </h1>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-stone-200 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="bookName" className="block text-sm font-medium text-stone-700 mb-1">
                书名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 select-none">《</span>
                <input
                  type="text"
                  id="bookName"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="block w-full pl-8 pr-8 py-3 rounded-lg border-stone-200 bg-stone-50 focus:border-amber-500 focus:ring-amber-500 text-base sm:text-sm transition-colors outline-none border focus:ring-1"
                  placeholder="请输入书名"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 select-none">》</span>
              </div>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-stone-700 mb-1">
                作者
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-stone-200 bg-stone-50 focus:border-amber-500 focus:ring-amber-500 text-base sm:text-sm transition-colors outline-none border focus:ring-1"
                placeholder="（选填）"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-stone-700 mb-1">
                你的经历/感悟
              </label>
              <textarea
                id="experience"
                rows={4}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border-stone-200 bg-stone-50 focus:border-amber-500 focus:ring-amber-500 text-base sm:text-sm transition-colors resize-none outline-none border focus:ring-1"
                placeholder="（选填）读这本书时你想到了什么？或者发生了什么故事？提供这些信息可以让“部分分享”更精准。"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => handleGenerate('full')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-stone-800 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              全书分享
            </button>
            <button
              onClick={() => handleGenerate('partial')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 border border-stone-300 text-sm font-medium rounded-lg text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              部分分享
            </button>
          </div>
        </div>

        {content && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-semibold text-stone-900">生成结果</h3>
              <button
                onClick={copyToClipboard}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                  copied ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                }`}
              >
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? '已复制' : '复制全文'}
              </button>
            </div>
            <div className="prose prose-stone max-w-none text-stone-700 whitespace-pre-wrap leading-relaxed text-base">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Bold, 
  Italic, 
  Link as LinkIcon,
  Code,
  List,
  Image,
  CheckCircle
} from 'lucide-react';

const ArticleForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    codeSnippet: '',
    authorName: '',
    estimatedReadTime: '',
  });

  const steps = [
    { id: 1, title: 'Article Details', description: 'Basic information' },
    { id: 2, title: 'Content', description: 'Write your article' },
    { id: 3, title: 'Code & Media', description: 'Add snippets and images' },
    { id: 4, title: 'Review', description: 'Final review' },
  ];

  const categories = [
    'Tutorial',
    'Analysis',
    'Backend',
    'Frontend',
    'Machine Learning',
    'Data Science',
    'API Design',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success('Article submitted successfully!');
    navigate('/blog');
  };

  const WYSIWYGToolbar = () => (
    <div className="flex items-center space-x-2 p-3 border-b border-white/5 bg-white/5 rounded-t-xl">
      <button className="p-2 hover:bg-white/10 rounded transition-colors">
        <Bold className="w-4 h-4 text-gray-300" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded transition-colors">
        <Italic className="w-4 h-4 text-gray-300" />
      </button>
      <div className="w-px h-6 bg-gray-600" />
      <button className="p-2 hover:bg-white/10 rounded transition-colors">
        <LinkIcon className="w-4 h-4 text-gray-300" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded transition-colors">
        <Code className="w-4 h-4 text-gray-300" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded transition-colors">
        <List className="w-4 h-4 text-gray-300" />
      </button>
      <button className="p-2 hover:bg-white/10 rounded transition-colors">
        <Image className="w-4 h-4 text-gray-300" />
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your article title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of your article..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="React, TypeScript, Tutorial"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Article Content *
              </label>
              <div className="border border-white/5 rounded-xl overflow-hidden">
                <WYSIWYGToolbar />
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your article content here... You can use Markdown syntax."
                  rows={15}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border-0 focus:outline-none text-white placeholder-gray-400 resize-none"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Supports Markdown formatting. Use **bold**, *italic*, `code`, and more.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code Snippet Preview
              </label>
              <div className="border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-white/5 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">Code Preview</span>
                  </div>
                  <select className="bg-gray-600 border border-gray-500 text-white px-2 py-1 rounded text-sm">
                    <option>JavaScript</option>
                    <option>TypeScript</option>
                    <option>Python</option>
                    <option>SQL</option>
                  </select>
                </div>
                <textarea
                  value={formData.codeSnippet}
                  onChange={(e) => handleInputChange('codeSnippet', e.target.value)}
                  placeholder="// Your code snippet here..."
                  rows={8}
                  className="w-full px-4 py-3 bg-black/20 border-0 focus:outline-none text-gray-300 placeholder-gray-500 resize-none font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-white/5 hover:border-gray-500 rounded-xl p-8 text-center transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">Drag and drop an image, or click to browse</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={formData.estimatedReadTime}
                onChange={(e) => handleInputChange('estimatedReadTime', e.target.value)}
                placeholder="e.g., 5 min read"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Article Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-white">{formData.title || 'Your Article Title'}</h4>
                  <p className="text-gray-400 mt-2">{formData.excerpt || 'Your article description...'}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm">
                    {formData.category || 'Category'}
                  </span>
                  <span className="text-gray-400">{formData.estimatedReadTime || '5 min read'}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {formData.authorName ? formData.authorName.substring(0, 2).toUpperCase() : 'AU'}
                    </span>
                  </div>
                  <span className="text-white">{formData.authorName || 'Author Name'}</span>
                </div>

                {formData.tags && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 text-gray-300 rounded text-xs"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Ready to publish!</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your article is ready to be submitted for review.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/blog')}
                className="p-2 hover:bg-white/5 backdrop-blur-xl rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Write New Article</h1>
                <p className="text-gray-400">Share your technical insights with the community</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-white/5 text-gray-300 rounded-xl hover:bg-white/5 backdrop-blur-xl transition-colors">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  index !== steps.length - 1 ? 'flex-1' : ''
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className={`${currentStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm">{step.description}</p>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    currentStep > step.id ? 'bg-cyan-500' : 'bg-white/5'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-white/5 text-gray-300 rounded-xl hover:bg-white/5 backdrop-blur-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            
            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
              >
                Publish Article
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-medium"
              >
                Next Step
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleForm;
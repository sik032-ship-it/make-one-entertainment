import React, { useState, useEffect } from 'react';
import { Review } from '@/api/entities';
import { ReviewLike } from '@/api/entities';
import { ReviewReport } from '@/api/entities';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Star, MessageSquare, Plus, Filter, Calendar, Edit2, Trash2, X, Heart, Flag, Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StarRating = ({ rating, setRating, readOnly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors cursor-pointer ${
          rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => !readOnly && setRating(star)}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
      />
    ))}
  </div>
);

const ImageUpload = ({ images, setImages, uploading, setUploading }) => {
  // 이미지 배열 타입 안전성 확보 및 null 값 필터링
  const safeImages = Array.isArray(images)
    ? images.filter(img => img && typeof img === 'string')
    : (images && typeof images === 'string' ? [images] : []);

  const handleFileSelect = async (e) => {
    console.log('파일 선택됨:', e.target.files); // 디버그 로그
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      console.log('업로드 시작, 파일 수:', files.length); // 디버그 로그
      
      const uploadPromises = files.map(async (file) => {
        console.log('업로드 중인 파일:', file.name, file.size); // 디버그 로그
        const { file_url } = await UploadFile({ file });
        console.log('업로드 완료된 URL:', file_url); // 디버그 로그
        return file_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('모든 업로드 완료:', uploadedUrls); // 디버그 로그
      
      setImages(prev => {
        const safePrev = Array.isArray(prev)
          ? prev.filter(img => img && typeof img === 'string')
          : (prev && typeof prev === 'string' ? [prev] : []);
        return [...safePrev, ...uploadedUrls.filter(url => url && typeof url === 'string')];
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const safePrev = Array.isArray(prev)
        ? prev.filter(img => img && typeof img === 'string')
        : (prev && typeof prev === 'string' ? [prev] : []);
      return safePrev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-4">
      {/* 파일 선택 버튼 */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <Camera className="w-4 h-4" />
          <span className="text-sm">이미지 첨부</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>업로드 중...</span>
          </div>
        )}
      </div>

      {/* 업로드된 이미지 미리보기 */}
      {safeImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {safeImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        최대 5장까지 업로드 가능합니다. (JPG, PNG, GIF)
      </p>
    </div>
  );
};

const ReviewImages = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // 이미지 배열 타입 안전성 확보 및 null 값 필터링
  const safeImages = Array.isArray(images)
    ? images.filter(img => img && typeof img === 'string')
    : (images && typeof images === 'string' ? [images] : []);

  if (safeImages.length === 0) return null;

  return (
    <>
      <div className="mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {safeImages.map((url, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(url)}
            >
              <img
                src={url}
                alt={`리뷰 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="확대된 리뷰 이미지"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit({ reason, details });
    setReason('');
    setDetails('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">리뷰 신고하기</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">신고 사유</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="신고 사유를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">부적절한 내용</SelectItem>
                <SelectItem value="spam">스팸</SelectItem>
                <SelectItem value="false_info">거짓 정보</SelectItem>
                <SelectItem value="offensive">욕설/비방</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용 (선택사항)</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="신고 사유를 자세히 설명해주세요"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              신고하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewCard = ({ review, currentUser, onEdit, onDelete, userLikes, onLike, onReport }) => {
  const isOwner = currentUser && currentUser.email === review.created_by;
  const hasLiked = userLikes.includes(review.id);

  const handleDelete = () => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      onDelete(review.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* 상단: 유저 정보와 별점 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {review.author.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{review.author}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(review.created_date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} readOnly />
          <span className="text-sm font-medium text-gray-700">({review.rating}.0)</span>

          {/* 수정/삭제 버튼 - 작성자에게만 표시 */}
          {isOwner && (
            <div className="flex gap-1 ml-3">
              <button
                onClick={() => onEdit(review)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="리뷰 수정"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="리뷰 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 중간: 참여 행사 */}
      {review.eventType && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {review.eventType}
          </span>
        </div>
      )}

      {/* 하단: 리뷰 내용 */}
      <p className="text-gray-700 leading-relaxed text-base mb-4">
        {review.content}
      </p>

      {/* 첨부된 이미지들 */}
      <ReviewImages images={review.image_urls} />

      {/* 좋아요/신고 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <button
          onClick={() => onLike(review.id)}
          disabled={!currentUser}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!currentUser ? '로그인 후 이용 가능합니다' : ''}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">
            좋아요 {review.likes_count || 0}
          </span>
        </button>

        <button
          onClick={() => onReport(review.id)}
          disabled={!currentUser || isOwner}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={!currentUser ? '로그인 후 이용 가능합니다' : isOwner ? '본인 리뷰는 신고할 수 없습니다' : ''}
        >
          <Flag className="w-4 h-4" />
          <span className="text-sm">신고</span>
        </button>
      </div>
    </div>
  );
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [userLikes, setUserLikes] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: '',
    eventType: '',
    author: '',
    image_urls: []
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchReviews();
    User.me().then(user => {
      setCurrentUser(user);
      setNewReview(prev => ({ ...prev, author: user.full_name || '' }));
      fetchUserLikes(user.email);
    }).catch(() => {
      setCurrentUser(null);
      setNewReview(prev => ({ ...prev, author: '' }));
    });
  }, []);

  const fetchReviews = async () => {
    const fetchedReviews = await Review.list('-created_date');
    setReviews(fetchedReviews);
  };

  const fetchUserLikes = async (userEmail) => {
    if (!userEmail) return;
    try {
      const likes = await ReviewLike.filter({ user_email: userEmail });
      setUserLikes(likes.map(like => like.review_id));
    } catch (error) {
      console.error('좋아요 데이터 로드 실패:', error);
    }
  };

  const handleLike = async (reviewId) => {
    if (!currentUser) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    try {
      const hasLiked = userLikes.includes(reviewId);

      if (hasLiked) {
        // 좋아요 취소
        const existingLike = await ReviewLike.filter({
          review_id: reviewId,
          user_email: currentUser.email
        });

        if (existingLike.length > 0) {
          await ReviewLike.delete(existingLike[0].id);

          setReviews(prevReviews => prevReviews.map(r =>
            r.id === reviewId ? { ...r, likes_count: Math.max(0, (r.likes_count || 0) - 1) } : r
          ));
          setUserLikes(prev => prev.filter(id => id !== reviewId));
        }
      } else {
        // 좋아요 추가
        await ReviewLike.create({
          review_id: reviewId,
          user_email: currentUser.email
        });

        setReviews(prevReviews => prevReviews.map(r =>
          r.id === reviewId ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r
        ));
        setUserLikes(prev => [...prev, reviewId]);
      }

      fetchReviews();
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleReport = (reviewId) => {
    if (!currentUser) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    const reviewToReport = reviews.find(r => r.id === reviewId);
    if (reviewToReport && currentUser.email === reviewToReport.created_by) {
      alert('본인 리뷰는 신고할 수 없습니다.');
      return;
    }
    setReportingReviewId(reviewId);
    setShowReportModal(true);
  };

  const handleSubmitReport = async (reportData) => {
    if (!currentUser || !reportingReviewId) return;

    try {
      const existingReport = await ReviewReport.filter({
        review_id: reportingReviewId,
        reporter_email: currentUser.email
      });

      if (existingReport.length > 0) {
        alert('이미 신고한 리뷰입니다.');
        return;
      }

      await ReviewReport.create({
        review_id: reportingReviewId,
        reporter_email: currentUser.email,
        reason: reportData.reason,
        details: reportData.details
      });

      setReviews(prevReviews => prevReviews.map(r =>
        r.id === reportingReviewId ? { ...r, reports_count: (r.reports_count || 0) + 1 } : r
      ));

      alert('신고가 접수되었습니다. 검토 후 적절한 조치를 취하겠습니다.');
      fetchReviews();
    } catch (error) {
      console.error('신고 처리 실패:', error);
      alert('신고 처리에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setShowReportModal(false);
      setReportingReviewId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.content || !newReview.author) return;

    try {
      // 이미지 배열 안전성 확보 및 null 값 필터링
      const safeImageUrls = Array.isArray(newReview.image_urls)
        ? newReview.image_urls.filter(url => url && typeof url === 'string')
        : [];

      if (editingReview) {
        // 수정 모드
        await Review.update(editingReview.id, {
          author: newReview.author,
          rating: newReview.rating,
          content: newReview.content,
          eventType: newReview.eventType,
          image_urls: safeImageUrls
        });
      } else {
        // 새 리뷰 생성
        await Review.create({
          author: newReview.author,
          rating: newReview.rating,
          content: newReview.content,
          eventType: newReview.eventType,
          eventDate: new Date().toISOString().split('T')[0],
          likes_count: 0,
          reports_count: 0,
          image_urls: safeImageUrls
        });
      }

      setShowForm(false);
      setEditingReview(null);
      setNewReview({ rating: 5, content: '', eventType: '', author: currentUser?.full_name || '', image_urls: [] });
      fetchReviews();
    } catch (error) {
      console.error('리뷰 저장 실패:', error);
      alert('리뷰 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    // 이미지 배열 안전성 확보 및 null 값 필터링
    const safeImageUrls = Array.isArray(review.image_urls)
      ? review.image_urls.filter(url => url && typeof url === 'string')
      : [];

    setNewReview({
      rating: review.rating,
      content: review.content,
      eventType: review.eventType || '',
      author: review.author,
      image_urls: safeImageUrls
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      // 관련된 좋아요와 신고도 삭제
      const likes = await ReviewLike.filter({ review_id: reviewId });
      const reports = await ReviewReport.filter({ review_id: reviewId });

      for (const like of likes) {
        await ReviewLike.delete(like.id);
      }

      for (const report of reports) {
        await ReviewReport.delete(report.id);
      }

      await Review.delete(reviewId);
      fetchReviews();
      if (currentUser) {
        fetchUserLikes(currentUser.email);
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    setNewReview({ rating: 5, content: '', eventType: '', author: currentUser?.full_name || '', image_urls: [] });
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.created_date) - new Date(a.created_date);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'likes') {
      return (b.likes_count || 0) - (a.likes_count || 0);
    }
    return 0;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 상단 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">고객 리뷰</h1>
            <p className="text-lg text-gray-600 mb-8">메이크원과 함께한 고객님들의 소중한 경험을 확인해보세요</p>

            {/* 통계 정보 */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <StarRating rating={Math.round(averageRating)} readOnly />
                  <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                </div>
                <p className="text-sm text-gray-500">평균 평점</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">{reviews.length}</div>
                <p className="text-sm text-gray-500">총 리뷰 수</p>
              </div>
            </div>
          </div>

          {/* 상단 액션 바 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* 정렬 필터 */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="rating">별점 높은 순</SelectItem>
                  <SelectItem value="likes">좋아요 많은 순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 리뷰 작성 버튼 */}
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingReview ? '수정 취소' : showForm ? '작성 취소' : '리뷰 작성하기'}
            </Button>
          </div>

          {/* 리뷰 작성/수정 폼 */}
          {showForm && (
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  {editingReview ? '리뷰 수정하기' : '리뷰 작성하기'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 별점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">평점을 매겨주세요</label>
                  <div className="flex items-center gap-4">
                    <StarRating
                      rating={newReview.rating}
                      setRating={(r) => setNewReview({...newReview, rating: r})}
                    />
                    <span className="text-sm text-gray-500">({newReview.rating}점)</span>
                  </div>
                </div>

                {/* 작성자 이름 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">작성자 이름</label>
                  <Input
                    placeholder="이름을 입력해주세요"
                    value={newReview.author}
                    onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                    required
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* 참여 행사 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">참여하신 행사</label>
                  <Select onValueChange={(v) => setNewReview({...newReview, eventType: v})} value={newReview.eventType}>
                    <SelectTrigger className="rounded-lg border-gray-300">
                      <SelectValue placeholder="참여했던 행사를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="팀빌딩">팀빌딩</SelectItem>
                      <SelectItem value="체육대회">체육대회</SelectItem>
                      <SelectItem value="축제">축제</SelectItem>
                      <SelectItem value="연예인행사">연예인행사</SelectItem>
                      <SelectItem value="기타행사">기타행사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 리뷰 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
                  <Textarea
                    placeholder="메이크원과 함께한 경험을 자세히 공유해주세요. 어떤 점이 좋았는지, 아쉬웠던 점은 무엇인지 솔직한 후기를 남겨주시면 다른 고객님들에게 도움이 됩니다."
                    value={newReview.content}
                    onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                    required
                    rows={4}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* 이미지 첨부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">사진 첨부</label>
                  <ImageUpload
                    images={newReview.image_urls}
                    setImages={(images) => {
                      const safeImages = Array.isArray(images)
                        ? images.filter(url => url && typeof url === 'string')
                        : [];
                      setNewReview({...newReview, image_urls: safeImages});
                    }}
                    uploading={uploading}
                    setUploading={setUploading}
                  />
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
                  >
                    {uploading ? '업로드 중...' : editingReview ? '리뷰 수정' : '리뷰 등록'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 리뷰 목록 */}
          <div className="space-y-6">
            {sortedReviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">아직 리뷰가 없습니다</h3>
                <p className="text-gray-400">첫 번째 리뷰를 작성해보세요!</p>
              </div>
            ) : (
              sortedReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUser={currentUser}
                  userLikes={userLikes}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onReport={handleReport}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />

      <Footer />
    </>
  );
}
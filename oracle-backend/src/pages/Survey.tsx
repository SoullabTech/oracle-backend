import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSurveyQuestions, submitSurveyResponses } from '../services/surveyService';
import { SurveyQuestion } from '../components/SurveyQuestion';
import { CrystalFocusMenu } from '../components/CrystalFocusMenu';
import type { Database } from '../lib/database.types';
import type { SurveyResponse, CrystalFocus } from '../types/survey';

type SurveyQuestion = Database['public']['Tables']['survey_questions']['Row'];

export function Survey() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [crystalFocus, setCrystalFocus] = useState<CrystalFocus | null>(null);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    navigate('/login');
    return null;
  }

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['surveyQuestions'],
    queryFn: getSurveyQuestions,
  });

  const submitMutation = useMutation({
    mutationFn: async (responses: SurveyResponse[]) => {
      if (!user || !crystalFocus) throw new Error('Missing required data');
      await submitSurveyResponses(user.id, responses, crystalFocus);
    },
    onSuccess: () => {
      navigate('/oracle');
    },
  });

  const handleAnswer = (questionId: string, value: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r =>
          r.questionId === questionId ? { ...r, answer: value } : r
        );
      }
      return [...prev, { questionId, answer: value }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (responses.length === 0) return;
    await submitMutation.mutateAsync(responses);
  };

  if (authLoading || isLoadingQuestions) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!crystalFocus) {
    return <CrystalFocusMenu onComplete={setCrystalFocus} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Elemental Profile Survey</h1>
        <p className="text-gray-600">
          Answer these questions to help us understand your elemental affinities.
          This will allow us to provide more personalized guidance for your {crystalFocus.type} journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions?.map(question => (
          <SurveyQuestion
            key={question.id}
            id={question.id}
            text={question.text}
            element={question.element}
            onAnswer={handleAnswer}
            currentAnswer={responses.find(r => r.questionId === question.id)?.answer}
          />
        ))}

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={
              responses.length === 0 ||
              submitMutation.isPending ||
              (questions && responses.length < questions.length)
            }
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitMutation.isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : questions && responses.length < questions.length ? (
              `Answer all questions (${responses.length}/${questions.length})`
            ) : (
              'Submit Survey'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [voice, setVoice] = useState('sage');
  const [element, setElement] = useState('Aether');
  const navigate = useNavigate();

  const completeProfile = async () => {
    const user = supabase.auth.user();
    if (!user) return alert('Not logged in');
    const { error } = await supabase
      .from('profiles')
      .insert([{ user_id: user.id, name, voice, element, onboarding_complete: true }]);
    if (error) return alert(error.message);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold">1. What’s your name?</h2>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border p-2 rounded"
          />
          <button
            disabled={!name}
            onClick={() => setStep(2)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold">2. Choose your voice & element</h2>
          <select
            value={voice}
            onChange={e => setVoice(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="sage">Sage Whisper</option>
            <option value="mystic">Mystic Flow</option>
            <option value="celestial">Celestial Guide</option>
          </select>
          <select
            value={element}
            onChange={e => setElement(e.target.value)}
            className="w-full border p-2 rounded mt-4"
          >
            <option>Fire</option>
            <option>Water</option>
            <option>Earth</option>
            <option>Air</option>
            <option>Aether</option>
          </select>
          <button
            onClick={completeProfile}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Finish Onboarding
          </button>
        </>
      )}
    </div>
  );
}

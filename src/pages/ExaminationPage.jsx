import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { TermStructureSetupView } from '../components/examination/TermStructureSetupView';

export const ExaminationPage = ({ showToast }) => {
  const { subTab } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Render Step 1 Term Structure View */}
      <TermStructureSetupView showToast={showToast} />
    </div>
  );
};

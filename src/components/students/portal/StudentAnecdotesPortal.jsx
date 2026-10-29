import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle, Award, Calendar, Sparkles, BookOpen, Smile } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { anecdoteService } from '../../../services/anecdoteService';
import { useErp } from '../../../context/ErpContext';

export const StudentAnecdotesPortal = () => {
  const { currentUser } = useErp();
  const student = currentUser?.student || {};

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    anecdoteService.getStudentTimeline(student.id, true)
      .then(data => setRecords(data))
      .catch(err => console.error('Student anecdotes error:', err))
      .finally(() => setLoading(false));
  }, [student.id]);

  const getSentimentPill = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 font-bold space-x-1 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>Teacher Praise & Merit</span>
          </Badge>
        );
      case 'Needs Improvement':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 font-bold space-x-1 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Guidance / Advice</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200 font-bold space-x-1 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
            <span>Classroom Observation</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Recognition Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>My Achievements & Teacher Observations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Praise, Merits & Growth Journey
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl font-medium leading-relaxed">
            Observations, recognitions, and constructive feedback shared by your teachers to celebrate your progress throughout this academic term.
          </p>
        </div>
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <Card className="py-16 text-center border-slate-200 shadow-xs">
          <Sparkles className="w-7 h-7 text-purple-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Loading recognitions & remarks...</p>
        </Card>
      ) : records.length === 0 ? (
        <Card className="py-16 text-center border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Smile className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Anecdotal Remarks Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When your teachers record praises, merits, or classroom observations, they will appear right here on your personal timeline.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((item, idx) => (
            <Card
              key={item.id || idx}
              className="border-slate-200/90 shadow-xs p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getSentimentPill(item.sentiment)}
                  <Badge variant="outline" className="text-[11px] font-bold bg-slate-100 text-slate-700">
                    {item.category}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.incident_date}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal bg-purple-50/40 p-3.5 rounded-xl border border-purple-100/60">
                  "{item.observation_text}"
                </p>

                {item.recorded_by_name && (
                  <p className="text-[11px] text-slate-500 font-medium pt-1">
                    Recorded by <strong className="text-slate-700 font-bold">{item.recorded_by_name}</strong>
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnecdotesPortal;

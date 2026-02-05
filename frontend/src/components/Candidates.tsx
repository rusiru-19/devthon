'use client';

import { useEffect, useState, useRef } from 'react';
import { Candidate } from '@/lib/types';
import { Icons } from '@/components/Icon';
import axios from 'axios';
import { ca } from 'date-fns/locale';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/* =======================
   Candidate Drawer
======================= */

function CandidateDrawer({
  candidate,
  onClose,
}: {
  candidate: Candidate | null;
  onClose: () => void;
}) {
  if (!candidate) return null;

  const analysis = candidate.aiAnalysis;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSchedule = () => {
    if (!selectedDate) {
      alert("Please select a date and time first!");
      return;
    }

    const formattedDate = selectedDate.toLocaleString();
    console.log(`Scheduling interview on ${formattedDate} for candidate ${candidate.id}`);
    axios.post(`${API_URL}/schedule`, {
      candidateId: candidate.id,
      date: selectedDate.toISOString(),
      candidateEmail: analysis?.candidate.email ,
      candidateName: analysis?.candidate.full_name ,

    })

    alert(`Interview scheduled for ${formattedDate} & email sent!`);
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white h-full overflow-y-auto shadow-xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold">
              {analysis?.candidate.full_name ?? candidate.fileName}
            </h2>
            <p className="text-sm text-slate-500">
              {analysis?.target_role ?? 'Unknown role'}
            </p>
            <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Select Interview Date & Time:</label>
      <input
        type="datetime-local"
        className="border p-2 rounded w-full max-w-xs"
        onChange={e => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
      />

      <button
        onClick={handleSchedule}
        className="bg-green-800 p-2 text-sm text-white hover:bg-green-700 rounded mt-2"
      >
        Schedule & Email Interview
      </button>
    </div>
          </div>
          <button onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!analysis ? (
            <div className="text-center text-slate-500">
              Analysis not generated yet
            </div>
          ) : (
            <>
              {/* Score */}
              <div className="flex items-center gap-4">
               
                <div className="text-4xl font-bold text-blue-600">
                  {analysis.cv_score.score}%
                </div>
                <div className="text-slate-600">
                  {analysis.cv_score.rating}
                </div>
              </div>

              {/* Summary */}
              <section>
                <h3 className="font-semibold mb-1">Summary</h3>
                <p className="text-sm text-slate-700">
                  {analysis.summary}
                </p>
              </section>

              {/* Skills */}
              <section>
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...analysis.skills.technical,
                    ...analysis.skills.tools,
                    ...analysis.skills.soft,
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Experience */}
              <section>
                <h3 className="font-semibold mb-2">Experience</h3>
                <div className="space-y-3">
                  {analysis.experience.map((exp, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <p className="font-medium">
                        {exp.job_title} – {exp.company}
                      </p>
                      <p className="text-xs text-slate-500">
                        {exp.duration}
                      </p>
                      <ul className="list-disc pl-5 text-sm">
                        {exp.key_points.map((p, j) => (
                          <li key={j}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Suggestions */}
              <section>
                <h3 className="font-semibold mb-2">
                  Improvement Suggestions
                </h3>
                <ul className="list-disc pl-5 text-sm text-slate-700">
                  {analysis.improvement_suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
   Main Page
======================= */
export  function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/candidates`);
    const data = await res.json();
    console.log('Fetched candidates:', data);
    setCandidates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);

    const formData = new FormData();
    Array.from(files).forEach(file =>
      formData.append('cvs', file)
    );

    await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    setUploading(false);
    fetchCandidates();
  };
  const parseAnalysis = (candidate: any) => {
  try {
    if (!candidate.aiAnalysis.raw) {
      console.log('No AI analysis found for candidate');
      return null;
    }
    const guddata = JSON.parse(candidate.aiAnalysis.raw)
        console.log('hutta', guddata);

    return guddata;
  } catch (err) {
    console.log('Failed to parse AI analysis for candidate', candidate.id, err);
    return null;
  }
};

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Candidates</h1>
            <p className="text-slate-500">
              Uploaded CVs & AI analysis
            </p>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Icons.Loader className="animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Icons.Upload />
                Upload CVs
              </>
            )}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept=".docx"
            multiple
            hidden
            onChange={e =>
              e.target.files && handleUpload(e.target.files)
            }
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Loading candidates…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left">Candidate</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                  {candidates.map(c => {
                const score = c.aiAnalysis?.cv_score?.score ?? '—';
                const name = c.aiAnalysis?.candidate?.full_name ?? c.fileName;
                const rating = c.aiAnalysis?.cv_score?.rating ?? '—';
                return (
                  <tr
                    key={c.id}
                    className="border-t hover:bg-blue-50 cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <td className="px-6 py-4">{name}</td>
                    <td className="px-6 py-4 text-center">{score}</td>
                    <td
                  className={`px-6 py-4 text-center font-medium ${
                    rating === 'Excellent' 
                      ? 'text-green-600'
                      : rating === 'Strong'
                      ? 'text-green-600'
                      : rating === 'Average'
                      ? 'text-yellow-600'
                      : 'text-slate-500'
                  }`}
                        >
                {rating}
              </td>
                                </tr>
                );
              })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CandidateDrawer
        candidate={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

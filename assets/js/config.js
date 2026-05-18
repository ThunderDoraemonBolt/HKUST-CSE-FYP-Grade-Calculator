// ──────────────────────────────────────────────────────────────────────────
// config.js — Grade scales, components, criteria, import targets
// ──────────────────────────────────────────────────────────────────────────

const GRADES = [
  { letter: "A+", points: 4.30 },
  { letter: "A",  points: 4.00 },
  { letter: "A-", points: 3.70 },
  { letter: "B+", points: 3.30 },
  { letter: "B",  points: 3.00 },
  { letter: "B-", points: 2.70 },
  { letter: "C+", points: 2.30 },
  { letter: "C",  points: 2.00 },
  { letter: "C-", points: 1.70 },
  { letter: "D",  points: 1.00 },
  { letter: "F",  points: 0.00 },
];

const SCALE = [
  { min: 4.15, letter: "A+", rowId: "sr-Ap" },
  { min: 3.85, letter: "A",  rowId: "sr-A"  },
  { min: 3.50, letter: "A-", rowId: "sr-Am" },
  { min: 3.15, letter: "B+", rowId: "sr-Bp" },
  { min: 2.85, letter: "B",  rowId: "sr-B"  },
  { min: 2.50, letter: "B-", rowId: "sr-Bm" },
  { min: 2.15, letter: "C+", rowId: "sr-Cp" },
  { min: 1.85, letter: "C",  rowId: "sr-C"  },
  { min: 1.35, letter: "C-", rowId: "sr-Cm" },
  { min: 0.50, letter: "D",  rowId: "sr-D"  },
  { min: 0.00, letter: "F",  rowId: "sr-F"  },
];

const COMPONENTS = {
  advisor: [
    {
      id: "adv_prop", label: "Project Proposal Report", compWeight: 0.05,
      criteria: [
        { id: "adv_prop_c1", label: "Project objective formulation, methodology & background", weight: 0.60 },
        { id: "adv_prop_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "adv_prop_c3", label: "Planning of future work", weight: 0.10 },
      ]
    },
    {
      id: "adv_ethics", label: "Individual Ethics Essay", compWeight: 0.05,
      criteria: [
        { id: "adv_ethics_c1", label: "Content",   weight: 0.40 },
        { id: "adv_ethics_c2", label: "Clarity",   weight: 0.30 },
        { id: "adv_ethics_c3", label: "Relevance", weight: 0.30 },
      ]
    },
    {
      id: "adv_prog", label: "Project Progress Report", compWeight: 0.20,
      criteria: [
        { id: "adv_prog_c1", label: "Work completed", weight: 0.60 },
        { id: "adv_prog_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "adv_prog_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "adv_final", label: "Final Project Report", compWeight: 0.35,
      criteria: [
        { id: "adv_final_c1", label: "Results obtained", weight: 0.60 },
        { id: "adv_final_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "adv_final_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "adv_oral", label: "Oral Presentation", compWeight: 0.30,
      criteria: [
        { id: "adv_oral_c1", label: "Project demonstration", weight: 0.40 },
        { id: "adv_oral_c2", label: "Delivery (oral, audience contact, slides, timing)", weight: 0.40 },
        { id: "adv_oral_c3", label: "Quality of answers", weight: 0.20 },
      ]
    },
    {
      id: "adv_monthly", label: "Monthly Reports (3 reports)", compWeight: 0.05,
      criteria: [
        { id: "adv_monthly_c1", label: "Report 1 (October) - Equal weight across all 3 reports", weight: 1/3 },
        { id: "adv_monthly_c2", label: "Report 2 (November) - Equal weight across all 3 reports", weight: 1/3 },
        { id: "adv_monthly_c3", label: "Report 3 (December/January) - Equal weight across all 3 reports", weight: 1/3 },
      ]
    },
  ],
  reader: [
    {
      id: "read_prop", label: "Project Proposal Report", compWeight: 0.05,
      criteria: [
        { id: "read_prop_c1", label: "Project objective formulation, methodology & background", weight: 0.60 },
        { id: "read_prop_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "read_prop_c3", label: "Planning of future work", weight: 0.10 },
      ]
    },
    {
      id: "read_prog", label: "Project Progress Report", compWeight: 0.15,
      criteria: [
        { id: "read_prog_c1", label: "Work completed", weight: 0.60 },
        { id: "read_prog_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "read_prog_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "read_final", label: "Final Project Report", compWeight: 0.35,
      criteria: [
        { id: "read_final_c1", label: "Results obtained", weight: 0.60 },
        { id: "read_final_c2", label: "Clarity & presentation (organization, English)", weight: 0.30 },
        { id: "read_final_c3", label: "Use of software engineering techniques", weight: 0.10 },
      ]
    },
    {
      id: "read_oral", label: "Oral Presentation", compWeight: 0.40,
      criteria: [
        { id: "read_oral_c1", label: "Project demonstration", weight: 0.40 },
        { id: "read_oral_c2", label: "Delivery (oral, audience contact, slides, timing)", weight: 0.40 },
        { id: "read_oral_c3", label: "Quality of answers", weight: 0.20 },
      ]
    },
    {
      id: "read_video", label: "Poster Session / Video Trailer", compWeight: 0.05,
      criteria: [
        { id: "read_video_c1", label: "Clarity & presentation of poster / video", weight: 0.50 },
        { id: "read_video_c2", label: "Information conveyed", weight: 0.50 },
      ]
    },
  ]
};

const IMPORT_TARGETS = {
  advisor: [
    { id: "adv_prop_c1", index: 1 },
    { id: "adv_prop_c2", index: 0 },
    { id: "adv_prop_c3", index: 2 },
    { id: "adv_prog_c1", index: 6 },
    { id: "adv_prog_c2", index: 5 },
    { id: "adv_prog_c3", index: 7 },
    { id: "adv_oral_c1", index: 10 },
    { id: "adv_oral_c2", index: 11 },
    { id: "adv_oral_c3", index: 12 },
    { id: "adv_final_c1", index: 15 },
    { id: "adv_final_c2", index: 14 },
    { id: "adv_final_c3", index: 16 },
    { id: "adv_ethics_c1", index: 23 },
    { id: "adv_ethics_c2", index: 24 },
    { id: "adv_ethics_c3", index: 25 },
  ],
  reader: [
    { id: "read_prop_c1", index: 1 },
    { id: "read_prop_c2", index: 0 },
    { id: "read_prop_c3", index: 2 },
    { id: "read_prog_c1", index: 6 },
    { id: "read_prog_c2", index: 5 },
    { id: "read_prog_c3", index: 7 },
    { id: "read_oral_c1", index: 10 },
    { id: "read_oral_c2", index: 11 },
    { id: "read_oral_c3", index: 12 },
    { id: "read_final_c1", index: 15 },
    { id: "read_final_c2", index: 14 },
    { id: "read_final_c3", index: 16 },
    { id: "read_video_c1", index: 20 },
    { id: "read_video_c2", index: 19 },
  ],
};

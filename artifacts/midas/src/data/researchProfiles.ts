import {
  sleepResearchContent,
  type ResearchQuestionData,
  type ResearchResult,
} from '@/data/researchData';

export type ResearchProfile = {
  id: string;
  matches: string[];
  matchAll?: string[];
  question: Omit<ResearchQuestionData, 'originalIdea'>;
  content: Omit<ResearchResult, 'question'>;
};

const parkinsonsQuestion: ResearchProfile['question'] = {
  refinedQuestion:
    'In a target population to be defined, how accurately can an AI or machine-learning model detect Parkinson’s disease at an early stage?',
  topic: "Parkinson's disease",
  subject: "Parkinson's disease",
  technology: 'Artificial intelligence / machine learning',
  researchTask: 'Detection / diagnosis',
  population: 'To be defined',
  exposure: 'AI or machine-learning model used for detection',
  outcome: 'Diagnostic/detection performance',
  researchType: 'Diagnostic accuracy / model evaluation',
  keyConcepts: [
    "Parkinson's disease",
    'artificial intelligence',
    'machine learning',
    'early detection',
    'diagnosis',
  ],
  keywords: [
    "Parkinson's disease",
    'artificial intelligence',
    'machine learning',
    'early detection',
    'diagnosis',
  ],
};

const airPollutionQuestion: ResearchProfile['question'] = {
  refinedQuestion:
    'Among children in the defined study area, how is ambient air pollution associated with asthma symptoms or exacerbations?',
  topic: 'Air pollution and asthma',
  subject: 'Asthma',
  technology: 'Ambient air pollution exposure measurement',
  researchTask: 'Exposure–outcome association',
  population: 'Children',
  exposure: 'Ambient air pollution, including PM2.5 and nitrogen dioxide',
  outcome: 'Asthma symptoms and exacerbations',
  researchType: 'Observational environmental health research',
  keyConcepts: [
    'air pollution',
    'asthma',
    'children',
    'PM2.5',
    'asthma exacerbations',
  ],
  keywords: [
    'air pollution',
    'asthma',
    'children',
    'PM2.5',
    'nitrogen dioxide',
    'asthma exacerbations',
  ],
};

const crisprQuestion: ResearchProfile['question'] = {
  refinedQuestion:
    'Among people with sickle cell disease who meet the defined eligibility criteria, what treatment response and safety outcomes follow CRISPR-based gene editing?',
  topic: 'CRISPR treatment for sickle cell disease',
  subject: 'Sickle cell disease',
  technology: 'CRISPR-based gene editing',
  researchTask: 'Therapeutic efficacy and safety evaluation',
  population: 'People with sickle cell disease who meet the defined eligibility criteria',
  exposure: 'CRISPR-based gene editing treatment',
  outcome: 'Treatment response, fetal hemoglobin, vaso-occlusive events, and safety',
  researchType: 'Interventional clinical research',
  keyConcepts: [
    'CRISPR',
    'gene editing',
    'sickle cell disease',
    'fetal hemoglobin',
    'treatment safety',
  ],
  keywords: [
    'CRISPR',
    'gene editing',
    'sickle cell disease',
    'hemoglobin',
    'treatment response',
    'long-term safety',
  ],
};

const sleepQuestion: ResearchProfile['question'] = {
  refinedQuestion:
    'Among medical students, how does sleep deprivation or reduced sleep duration relate to memory performance?',
  topic: 'Sleep and cognitive performance',
  subject: 'Sleep deprivation and memory',
  technology: 'Sleep measurement and cognitive testing',
  researchTask: 'Exposure–outcome association',
  population: 'Medical students',
  exposure: 'Sleep deprivation / reduced sleep duration',
  outcome: 'Memory performance',
  researchType: 'Observational health research',
  keyConcepts: [
    'sleep deprivation',
    'memory',
    'medical students',
    'cognitive performance',
    'clinical training',
  ],
  keywords: [
    'sleep deprivation',
    'sleep restriction',
    'memory performance',
    'working memory',
    'medical students',
    'clinical trainees',
  ],
};

export const researchProfiles: ResearchProfile[] = [
  {
    id: 'parkinsons-ai-detection',
    matches: ['parkinson', 'artificial intelligence', 'machine learning', 'ai detection', 'diagnos'],
    matchAll: ['parkinson'],
    question: parkinsonsQuestion,
    content: {
      literature: [
        {
          id: 'parkinsons-lit-01',
          title: 'Mock example: Machine learning approaches for early Parkinson’s detection',
          authors: 'Prototype author group',
          year: 2024,
          studyType: 'Diagnostic accuracy',
          area: 'Neurology and machine learning',
          summary:
            'A fictional example comparing model predictions with a defined clinical reference standard for early Parkinson’s detection.',
          relevance:
            'Shows why the reference diagnosis, threshold, and evaluation population need to be specified together.',
        },
        {
          id: 'parkinsons-lit-02',
          title: 'Mock example: Digital biomarkers for Parkinsonian motor symptoms',
          authors: 'Prototype author group',
          year: 2023,
          studyType: 'Prospective validation',
          area: 'Digital health',
          summary:
            'A fictional validation example using movement signals to explore whether digital features add information beyond a clinical assessment.',
          relevance:
            'Useful for thinking about feature extraction, external validation, and clinically meaningful performance.',
        },
        {
          id: 'parkinsons-lit-03',
          title: 'Mock example: Reporting an AI model for neurological diagnosis',
          authors: 'Prototype author group',
          year: 2022,
          studyType: 'Methods review',
          area: 'Clinical prediction',
          summary:
            'A fictional methods example focused on transparent reporting of training data, test sets, calibration, and subgroup performance.',
          relevance:
            'Highlights the reporting details needed before a model can be compared fairly with other approaches.',
        },
      ],
      searchStrategy: {
        keywords: parkinsonsQuestion.keywords,
        booleanQuery:
          '("Parkinson* disease") AND ("artificial intelligence" OR "machine learning") AND ("early detection" OR diagnos*)',
        databases: ['PubMed', 'IEEE Xplore', 'Scopus', 'Google Scholar'],
      },
      methodologies: [
        {
          id: 'parkinsons-retrospective',
          name: 'Retrospective diagnostic accuracy study',
          fit:
            'A practical prototype route when labelled clinical records or previously collected signals are available.',
          advantages: ['Fast model comparison', 'Clear test-set evaluation', 'Lower participant burden'],
          limitations: ['Risk of data leakage', 'Missing-data bias', 'May not represent future clinical use'],
        },
        {
          id: 'parkinsons-prospective',
          name: 'Prospective validation study',
          fit:
            'A stronger fit for testing whether a locked model performs consistently on newly collected participants.',
          advantages: ['Closer to real-world use', 'Temporal separation is clearer', 'Supports workflow testing'],
          limitations: ['More time and coordination', 'Requires a predefined model', 'Needs careful reference assessment'],
        },
        {
          id: 'parkinsons-case-control',
          name: 'Case-control classification study',
          fit:
            'Useful for an early feasibility study, provided the control group reflects the intended diagnostic setting.',
          advantages: ['Efficient for initial signal finding', 'Straightforward group comparison', 'Good for feature exploration'],
          limitations: ['Spectrum bias can inflate performance', 'Controls may be unrealistic', 'Does not prove clinical benefit'],
        },
      ],
      instruments: [
        {
          id: 'parkinsons-reference',
          name: 'Defined clinical reference diagnosis',
          measures: 'Reference classification used to label Parkinson’s disease status',
          population: 'Participants in the chosen diagnostic setting',
          validationStatus: 'Protocol-dependent; define assessor and criteria',
          source: 'Clinical guideline or approved study protocol',
        },
        {
          id: 'parkinsons-mds-updrs',
          name: 'MDS-UPDRS clinical assessment',
          measures: 'Motor and non-motor features relevant to Parkinson’s disease',
          population: 'People assessed for Parkinsonian symptoms',
          validationStatus: 'Established scale; verify training and permissions',
          source: 'Original scale publication / rights holder',
        },
        {
          id: 'parkinsons-digital-signal',
          name: 'Digital movement or speech task',
          measures: 'Candidate voice, gait, tapping, or movement features',
          population: 'Define device, task, and accessibility requirements',
          validationStatus: 'Prototype measure; establish reliability before use',
          source: 'Pre-specified task and signal-processing protocol',
        },
      ],
      ethics: {
        considerations: [
          'Informed consent: explain how health data, voice, video, or movement signals will be used.',
          'Privacy: treat biometric and neurological data as sensitive and minimize re-identification risk.',
          'Algorithmic bias: check performance across relevant age, sex, language, device, and access groups.',
          'Clinical expectations: do not present a prototype prediction as a diagnosis or treatment recommendation.',
          'Data governance: define model access, retention, sharing, and deletion before collecting data.',
        ],
        disclaimer:
          'Educational prototype guidance only. This is not clinical validation, medical advice, or ethics approval.',
      },
      dataCollection: {
        participants:
          'Participants from the defined diagnostic population, with a clear Parkinson’s disease reference assessment and comparison strategy.',
        variables: [
          'Model input signal or clinical feature set',
          'Reference diagnosis',
          'Predicted class or risk score',
          'Age, sex, language, device, and relevant clinical context',
          'Missingness, exclusions, and model threshold',
        ],
        methods: ['Structured clinical assessment', 'Pre-specified digital task', 'Secure signal capture', 'Dataset quality log'],
        inclusion: ['Matches the defined diagnostic setting', 'Provides informed consent where required', 'Has the minimum reference and input data'],
        exclusion: ['Unusable or duplicated signal', 'Missing reference assessment', 'Data collected outside the approved protocol'],
      },
      analysis: {
        variables: [
          { name: 'Model prediction', type: 'Binary or continuous', role: 'Index test' },
          { name: 'Reference diagnosis', type: 'Binary / categorical', role: 'Reference standard' },
          { name: 'Sensitivity and specificity', type: 'Percentage', role: 'Primary performance outcomes' },
          { name: 'Age or clinical subgroup', type: 'Continuous / categorical', role: 'Possible effect modifier' },
        ],
        descriptive: ['Participant flow and exclusions', 'Class balance and missingness', 'Input feature distribution', 'Performance by relevant subgroup'],
        statistical: ['Confusion matrix with sensitivity and specificity', 'AUROC and precision-recall summary', 'Calibration assessment and confidence intervals'],
        note:
          'Model performance is not the same as clinical usefulness. A qualified methods and clinical reviewer should define the reference standard, thresholds, and validation plan.',
      },
      journals: [
        {
          name: 'npj Parkinson’s Disease',
          area: 'Parkinson’s disease and translational research',
          reason: 'A plausible prototype fit when the contribution is centered on Parkinson’s detection or disease measurement.',
          relevanceScore: 89,
        },
        {
          name: 'Movement Disorders Clinical Practice',
          area: 'Clinical movement-disorders research',
          reason: 'A possible fit for clinically interpretable diagnostic or digital-assessment work.',
          relevanceScore: 82,
        },
        {
          name: 'Journal of Medical Internet Research',
          area: 'Digital health and health technology',
          reason: 'A possible audience when the main contribution is the evaluation of an AI-enabled health workflow.',
          relevanceScore: 76,
        },
      ],
      beginnerMistakes: [
        { title: 'Letting the model see the answer', detail: 'Patient overlap, duplicated recordings, or preprocessing leakage can make performance look much better than it is.' },
        { title: 'Reporting accuracy alone', detail: 'Include sensitivity, specificity, calibration, uncertainty, and the consequences of false results.' },
        { title: 'Using unrealistic controls', detail: 'A model separating clear cases from healthy volunteers may not work in a real diagnostic pathway.' },
        { title: 'Skipping external validation', detail: 'A model can learn the collection site, device, or language instead of the disease signal.' },
        { title: 'Calling a prediction a diagnosis', detail: 'A prototype classifier needs clinical validation and oversight before any diagnostic claim.' },
      ],
    },
  },
  {
    id: 'air-pollution-asthma-children',
    matches: ['air pollution', 'asthma', 'pm2.5', 'nitrogen dioxide', 'children', 'pediatric'],
    matchAll: ['asthma'],
    question: airPollutionQuestion,
    content: {
      literature: [
        {
          id: 'air-lit-01',
          title: 'Mock example: Fine particulate exposure and asthma symptoms in children',
          authors: 'Prototype author group',
          year: 2024,
          studyType: 'Panel study',
          area: 'Pediatric environmental health',
          summary:
            'A fictional example linking repeated air-quality estimates with symptom reports collected from children over time.',
          relevance:
            'Demonstrates repeated measurement and the importance of defining exposure windows before analysis.',
        },
        {
          id: 'air-lit-02',
          title: 'Mock example: Traffic-related nitrogen dioxide and asthma exacerbations',
          authors: 'Prototype author group',
          year: 2023,
          studyType: 'Cohort study',
          area: 'Respiratory epidemiology',
          summary:
            'A fictional cohort example examining traffic-related pollution alongside healthcare visits and rescue medication use.',
          relevance:
            'Offers a starting point for thinking about confounding, area-level exposure, and clinical outcomes.',
        },
        {
          id: 'air-lit-03',
          title: 'Mock example: Environmental inequity in children’s asthma exposure',
          authors: 'Prototype author group',
          year: 2022,
          studyType: 'Geospatial analysis',
          area: 'Environmental justice',
          summary:
            'A fictional analysis comparing pollution burdens across neighborhoods while avoiding identifiable household mapping.',
          relevance:
            'Prompts a careful look at geography, access, and whether average exposure represents a child’s actual environment.',
        },
      ],
      searchStrategy: {
        keywords: airPollutionQuestion.keywords,
        booleanQuery:
          '(asthma OR wheeze) AND ("air pollution" OR PM2.5 OR "nitrogen dioxide") AND (child* OR pediatric)',
        databases: ['PubMed', 'Embase', 'Scopus', 'Google Scholar'],
      },
      methodologies: [
        {
          id: 'air-panel',
          name: 'Prospective panel study',
          fit:
            'A strong starting point when repeated symptom, medication, or peak-flow measures can be collected from children.',
          advantages: ['Captures short-term changes', 'Each child can serve as their own context', 'Supports exposure-window comparisons'],
          limitations: ['Participant burden', 'Time-varying confounding', 'Missing daily measurements'],
        },
        {
          id: 'air-cohort',
          name: 'Prospective cohort study',
          fit:
            'Useful for following children across a season or school year while relating exposure estimates to asthma outcomes.',
          advantages: ['Temporal sequence is clearer', 'Can study several outcomes', 'Supports subgroup questions'],
          limitations: ['Needs retention plans', 'Exposure misclassification', 'Confounding by housing and access'],
        },
        {
          id: 'air-case-crossover',
          name: 'Case-crossover design',
          fit:
            'A possible fit for short-term pollution triggers when the outcome is a defined asthma event and comparison windows are defensible.',
          advantages: ['Controls for stable individual characteristics', 'Efficient for acute events', 'Useful for short exposure lags'],
          limitations: ['Requires careful referent selection', 'Only suits certain outcomes', 'Sensitive to time trends'],
        },
      ],
      instruments: [
        {
          id: 'air-isaac',
          name: 'Childhood asthma symptom questionnaire',
          measures: 'Wheeze, cough, nighttime symptoms, activity limitation, and medication use',
          population: 'Children; verify age, language, and caregiver administration',
          validationStatus: 'Use an established version; verify permissions and adaptation',
          source: 'Original questionnaire publication / rights holder',
        },
        {
          id: 'air-spirometry',
          name: 'Spirometry',
          measures: 'Pulmonary function measures such as FEV1 and FVC',
          population: 'Children able to complete quality-assured testing',
          validationStatus: 'Requires trained administration and quality checks',
          source: 'Current respiratory testing standard / protocol',
        },
        {
          id: 'air-peak-flow',
          name: 'Peak-flow or symptom diary',
          measures: 'Repeated home observations of airflow or asthma symptoms',
          population: 'Children with caregiver support and a defined monitoring schedule',
          validationStatus: 'Document device, training, adherence, and timing',
          source: 'Study-specific diary and device instructions',
        },
      ],
      ethics: {
        considerations: [
          'Permission and assent: obtain caregiver permission and age-appropriate child assent where required.',
          'Privacy: location and school information can reveal a child’s routine; collect only the geography needed.',
          'Burden: keep diaries, sensors, and visits proportionate to the child’s age and health.',
          'Environmental justice: avoid framing pollution exposure as an individual failure when structural factors matter.',
          'Clinical safety: define what happens if data suggest uncontrolled asthma or an urgent symptom.',
        ],
        disclaimer:
          'Educational prototype guidance only. This is not pediatric medical advice, legal advice, or ethics approval.',
      },
      dataCollection: {
        participants:
          'Children with a defined asthma status who live or attend school in the selected study area, with caregiver involvement as required.',
        variables: [
          'PM2.5 and nitrogen dioxide exposure estimate',
          'Asthma symptoms, exacerbations, or healthcare use',
          'Medication and peak-flow or spirometry measure',
          'Weather, season, tobacco smoke, and housing context',
          'Neighborhood or school setting at an appropriate privacy level',
        ],
        methods: ['Caregiver questionnaire', 'Child symptom diary', 'Spirometry or peak-flow check', 'Linked air-quality estimate'],
        inclusion: ['Falls within the defined child age range', 'Meets the stated asthma definition', 'Has required caregiver permission and assent'],
        exclusion: ['Cannot complete the study safely', 'Missing the minimum exposure or outcome window', 'Duplicate enrollment across study sites'],
      },
      analysis: {
        variables: [
          { name: 'PM2.5 or NO2 estimate', type: 'Continuous', role: 'Primary exposure' },
          { name: 'Asthma symptom or event measure', type: 'Count / binary / score', role: 'Primary outcome' },
          { name: 'Temperature and season', type: 'Continuous / categorical', role: 'Potential confounder' },
          { name: 'Child and household factors', type: 'Categorical / continuous', role: 'Potential confounders or modifiers' },
        ],
        descriptive: ['Exposure distribution by time and place', 'Symptom and event frequency', 'Diary completion and missingness', 'Participant characteristics'],
        statistical: ['Mixed-effects model for repeated observations', 'Lagged or distributed-lag exposure analysis', 'Sensitivity analysis for alternative exposure definitions'],
        note:
          'Environmental exposure estimates are imperfect proxies. A qualified epidemiologist should review confounding, lag choices, missing data, and the interpretation of associations.',
      },
      journals: [
        {
          name: 'Environmental Health Perspectives',
          area: 'Environmental and population health',
          reason: 'A plausible prototype fit when the study connects air pollution exposure with health outcomes and equity.',
          relevanceScore: 87,
        },
        {
          name: 'Thorax',
          area: 'Respiratory medicine',
          reason: 'A possible audience for rigorous asthma, lung-function, and respiratory exposure research.',
          relevanceScore: 83,
        },
        {
          name: 'Pediatric Pulmonology',
          area: 'Child respiratory health',
          reason: 'A natural prototype direction when the population and outcomes are specifically pediatric.',
          relevanceScore: 80,
        },
      ],
      beginnerMistakes: [
        { title: 'Treating a monitor as a personal exposure', detail: 'A station or neighborhood average may not represent indoor, school, travel, and home exposures equally.' },
        { title: 'Ignoring time windows', detail: 'Make the exposure period and symptom lag explicit before testing associations.' },
        { title: 'Overlooking confounding', detail: 'Weather, season, viral illness, smoking, housing, and access to care can shape the result.' },
        { title: 'Collecting too much location data', detail: 'Use the least precise geography that can still answer the question and protect children’s privacy.' },
        { title: 'Making a causal claim from an association', detail: 'An observed relationship needs careful design and assumptions before it can support causal language.' },
      ],
    },
  },
  {
    id: 'crispr-sickle-cell',
    matches: ['crispr', 'sickle cell', 'gene editing', 'hemoglobin', 'gene therapy'],
    matchAll: ['sickle cell'],
    question: crisprQuestion,
    content: {
      literature: [
        {
          id: 'crispr-lit-01',
          title: 'Mock example: CRISPR-based treatment response in sickle cell disease',
          authors: 'Prototype author group',
          year: 2024,
          studyType: 'Early-phase clinical study',
          area: 'Gene editing and hematology',
          summary:
            'A fictional example tracking engraftment, fetal hemoglobin, symptoms, and adverse events after an edited-cell intervention.',
          relevance:
            'Shows why response, durability, and safety need to be planned as separate outcome families.',
        },
        {
          id: 'crispr-lit-02',
          title: 'Mock example: Measuring hemoglobin changes after gene editing',
          authors: 'Prototype author group',
          year: 2023,
          studyType: 'Translational study',
          area: 'Red-cell biology',
          summary:
            'A fictional laboratory-to-clinic example connecting edited-cell characteristics with hematologic measurements.',
          relevance:
            'Useful for separating biological activity from patient-important clinical benefit.',
        },
        {
          id: 'crispr-lit-03',
          title: 'Mock example: Long-term follow-up after an edited-cell therapy',
          authors: 'Prototype author group',
          year: 2022,
          studyType: 'Safety follow-up',
          area: 'Cell and gene therapy safety',
          summary:
            'A fictional follow-up framework for delayed adverse events, durability, fertility questions, and late clinical outcomes.',
          relevance:
            'Makes the long observation horizon visible before a treatment study is designed.',
        },
      ],
      searchStrategy: {
        keywords: crisprQuestion.keywords,
        booleanQuery:
          '("sickle cell disease") AND (CRISPR OR "gene editing") AND (hemoglobin OR "treatment response" OR safety)',
        databases: ['PubMed', 'Embase', 'Cochrane Library', 'ClinicalTrials.gov'],
      },
      methodologies: [
        {
          id: 'crispr-early-phase',
          name: 'Early-phase single-arm treatment study',
          fit:
            'A common prototype structure for describing feasibility, biologic response, and short-term safety of an emerging therapy.',
          advantages: ['Clear treatment pathway', 'Detailed safety observation', 'Useful for early feasibility'],
          limitations: ['No randomized comparator', 'Small samples', 'Response can be hard to attribute'],
        },
        {
          id: 'crispr-prospective',
          name: 'Prospective longitudinal cohort',
          fit:
            'A good fit for following treated participants over time for durability, symptoms, laboratory measures, and late safety.',
          advantages: ['Tracks change over time', 'Supports patient-centered outcomes', 'Makes follow-up explicit'],
          limitations: ['Long retention horizon', 'Loss to follow-up', 'Time-varying care can complicate interpretation'],
        },
        {
          id: 'crispr-translational',
          name: 'Translational laboratory-clinical study',
          fit:
            'Useful when the project needs to connect editing, cell quality, hematologic response, and clinical outcomes.',
          advantages: ['Connects mechanism to outcome', 'Supports biological plausibility', 'Can define exploratory biomarkers'],
          limitations: ['Complex coordination', 'Many measurements', 'Biologic signal may not equal clinical benefit'],
        },
      ],
      instruments: [
        {
          id: 'crispr-hematology',
          name: 'Hemoglobin fraction and blood-count panel',
          measures: 'Fetal hemoglobin, hemoglobin level, cell counts, and hemolysis-related measures',
          population: 'People with sickle cell disease in the treatment pathway',
          validationStatus: 'Standard laboratory measures; define timing and laboratory procedures',
          source: 'Clinical laboratory protocol and assay documentation',
        },
        {
          id: 'crispr-pain',
          name: 'Vaso-occlusive pain and healthcare-use diary',
          measures: 'Pain episodes, urgent visits, admissions, analgesic use, and recovery time',
          population: 'Treated participants with a defined reporting schedule',
          validationStatus: 'Operational definitions required; patient-reported measures need review',
          source: 'Study protocol and selected patient-reported outcome instrument',
        },
        {
          id: 'crispr-safety',
          name: 'Adverse-event and long-term follow-up schedule',
          measures: 'Treatment-related adverse events, organ effects, fertility considerations, and delayed events',
          population: 'All treated participants who consent to required follow-up',
          validationStatus: 'Protocol and regulatory requirements determine the schedule',
          source: 'Approved clinical protocol and safety-monitoring plan',
        },
      ],
      ethics: {
        considerations: [
          'Informed consent: explain uncertainty, alternatives, potential irreversibility, and long-term follow-up.',
          'Genetic and family implications: clarify what genomic information is collected, stored, and shared.',
          'Long-term safety: plan monitoring for delayed effects rather than treating the study end as the end of risk.',
          'Reproductive and fertility considerations: discuss relevant risks and support participant questions without pressure.',
          'Access and fairness: avoid promising a cure and consider who can realistically reach specialized treatment.',
        ],
        disclaimer:
          'Educational prototype guidance only. This is not a treatment recommendation, clinical-trial approval, or regulatory advice.',
      },
      dataCollection: {
        participants:
          'People with sickle cell disease who meet the defined treatment protocol eligibility criteria and consent to follow-up.',
        variables: [
          'Baseline and follow-up hemoglobin fractions',
          'Vaso-occlusive events and healthcare use',
          'Adverse events and serious adverse events',
          'Cell-product or editing-process quality measures',
          'Transfusion, medication, and follow-up status',
        ],
        methods: ['Clinical visit schedule', 'Laboratory blood testing', 'Patient-reported symptom diary', 'Structured adverse-event review'],
        inclusion: ['Meets the protocol’s disease and treatment criteria', 'Can complete the required follow-up', 'Provides informed consent'],
        exclusion: ['Does not meet approved treatment eligibility', 'Cannot complete required safety monitoring', 'Missing essential baseline measures'],
      },
      analysis: {
        variables: [
          { name: 'Fetal hemoglobin change', type: 'Continuous', role: 'Biologic response outcome' },
          { name: 'Vaso-occlusive events', type: 'Count / time-to-event', role: 'Patient-important outcome' },
          { name: 'Adverse events', type: 'Categorical / rate', role: 'Primary safety outcome' },
          { name: 'Follow-up duration', type: 'Time', role: 'Exposure window for durability and safety' },
        ],
        descriptive: ['Treatment disposition and follow-up', 'Laboratory response over time', 'Event counts and exposure time', 'Adverse-event severity and timing'],
        statistical: ['Paired baseline-to-follow-up summaries', 'Time-to-event or event-rate analysis', 'Safety summaries with transparent denominators and uncertainty'],
        note:
          'Gene-editing research needs specialist clinical, statistical, and regulatory oversight. Biological response should not be presented as proof of cure or permanent benefit.',
      },
      journals: [
        {
          name: 'Blood',
          area: 'Hematology and blood disorders',
          reason: 'A plausible prototype fit for rigorous sickle cell, hematologic response, or treatment-safety research.',
          relevanceScore: 90,
        },
        {
          name: 'The Lancet Haematology',
          area: 'Clinical hematology',
          reason: 'A possible audience for clinically important treatment outcomes and long-term follow-up.',
          relevanceScore: 86,
        },
        {
          name: 'Haematologica',
          area: 'Hematology and translational science',
          reason: 'A possible fit when the study connects gene editing, laboratory response, and patient outcomes.',
          relevanceScore: 79,
        },
      ],
      beginnerMistakes: [
        { title: 'Calling early response a cure', detail: 'Laboratory improvement, symptom change, and durable clinical benefit are different claims.' },
        { title: 'Planning too little follow-up', detail: 'Cell and gene therapies can require observation well beyond the initial treatment window.' },
        { title: 'Hiding the denominator', detail: 'Safety summaries need clear participant counts, exposure time, severity, and missing follow-up.' },
        { title: 'Treating rare events as impossible', detail: 'A small early study may not detect uncommon or delayed risks.' },
        { title: 'Leaving alternatives unexplained', detail: 'Consent should cover uncertainty, existing options, burdens, and the participant’s right to withdraw.' },
      ],
    },
  },
  {
    id: 'sleep-memory-example',
    matches: ['sleep', 'memory'],
    matchAll: ['sleep', 'memory'],
    question: sleepQuestion,
    content: sleepResearchContent,
  },
];
type Domain =
  | "medicine"
  | "biology"
  | "chemistry"
  | "physics"
  | "computer science / AI"
  | "mathematics"
  | "psychology"
  | "social sciences"
  | "education"
  | "environmental science"
  | "engineering"
  | "humanities"
  | "law / policy"
  | "business"
  | "interdisciplinary";

type ResearchQuestion = {
  originalIdea: string;
  refinedQuestion: string;
  topic: string;
  subject: string;
  technology: string;
  researchTask: string;
  population: string;
  exposure: string;
  outcome: string;
  researchType: string;
  keyConcepts: string[];
  keywords: string[];
};

type LiteratureItem = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  studyType: string;
  area: string;
  summary: string;
  relevance: string;
  source: string;
  sourceUrl: string;
  doi?: string;
  identifier?: string;
};

type RoadmapItem = {
  stepId: string;
  title: string;
  focus: string;
  actions: string[];
  evidenceAnchor: string;
};

export type ResearchResult = {
  question: ResearchQuestion;
  domain: Domain;
  sourcePlan: {
    providers: string[];
    query: string;
    retrievedAt: string;
    note: string;
  };
  literature: LiteratureItem[];
  evidence: {
    sourceCount: number;
    summary: string;
    gaps: string[];
    caveat: string;
  };
  searchStrategy: {
    keywords: string[];
    booleanQuery: string;
    databases: string[];
  };
  methodologies: Array<{
    id: string;
    name: string;
    fit: string;
    advantages: string[];
    limitations: string[];
  }>;
  instruments: Array<{
    id: string;
    name: string;
    measures: string;
    population: string;
    validationStatus: string;
    source: string;
  }>;
  ethics: {
    considerations: string[];
    disclaimer: string;
  };
  dataCollection: {
    participants: string;
    variables: string[];
    methods: string[];
    inclusion: string[];
    exclusion: string[];
  };
  analysis: {
    variables: Array<{ name: string; type: string; role: string }>;
    descriptive: string[];
    statistical: string[];
    note: string;
  };
  journals: Array<{
    name: string;
    area: string;
    reason: string;
    relevanceScore: number;
  }>;
  beginnerMistakes: Array<{ title: string; detail: string }>;
  roadmap: RoadmapItem[];
};

export type ResearchProcessingResponse =
  | ResearchResult
  | {
      needsNarrowing: true;
      message: string;
      suggestions: string[];
    };

type SourceRecord = {
  source: string;
  sourceUrl: string;
  title: string;
  authors: string;
  year: number | null;
  doi?: string;
  identifier?: string;
  abstract?: string;
  studyType?: string;
  area?: string;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "be",
  "by",
  "can",
  "does",
  "early",
  "effect",
  "for",
  "from",
  "how",
  "in",
  "impact",
  "improve",
  "is",
  "of",
  "on",
  "or",
  "study",
  "the",
  "to",
  "use",
  "using",
  "what",
  "with",
]);

const DOMAIN_RULES: Array<{ domain: Domain; terms: string[] }> = [
  {
    domain: "medicine",
    terms: [
      "disease",
      "patient",
      "clinical",
      "diagnos",
      "treatment",
      "therapy",
      "symptom",
      "hospital",
      "cancer",
      "parkinson",
      "asthma",
      "sickle cell",
      "health",
    ],
  },
  {
    domain: "biology",
    terms: ["gene", "genome", "cell", "protein", "microbiome", "organism", "crispr", "biology"],
  },
  {
    domain: "chemistry",
    terms: ["molecule", "catalyst", "polymer", "reaction", "synthesis", "chemical", "spectroscopy"],
  },
  {
    domain: "physics",
    terms: ["quantum", "particle", "relativity", "energy", "matter", "laser", "astrophysics", "physics"],
  },
  {
    domain: "computer science / AI",
    terms: ["ai", "artificial intelligence", "machine learning", "deep learning", "algorithm", "software", "computer", "neural"],
  },
  {
    domain: "mathematics",
    terms: ["theorem", "proof", "equation", "topology", "algebra", "geometry", "statistics", "mathematics"],
  },
  {
    domain: "psychology",
    terms: ["behavior", "cognition", "mental health", "emotion", "anxiety", "depression", "psychology", "wellbeing"],
  },
  {
    domain: "social sciences",
    terms: ["society", "community", "inequality", "survey", "interview", "culture", "social", "migration"],
  },
  {
    domain: "education",
    terms: ["student", "school", "teacher", "learning", "curriculum", "classroom", "education", "academic"],
  },
  {
    domain: "environmental science",
    terms: ["climate", "pollution", "air quality", "water", "soil", "environment", "biodiversity", "emission", "temperature", "urban heat", "tree", "canopy", "green space"],
  },
  {
    domain: "engineering",
    terms: ["design", "robot", "sensor", "材料", "infrastructure", "manufacturing", "mechanical", "engineering"],
  },
  {
    domain: "humanities",
    terms: ["literature", "language", "history", "art", "philosophy", "archive", "culture", "humanities"],
  },
  {
    domain: "law / policy",
    terms: ["law", "legal", "policy", "regulation", "court", "governance", "rights", "legislation"],
  },
  {
    domain: "business",
    terms: ["business", "market", "firm", "consumer", "management", "finance", "entrepreneur", "organization"],
  },
];

function cleanIdea(idea: string) {
  return idea.trim().replace(/\s+/g, " ");
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function stripPunctuation(value: string) {
  return value.replace(/^[("'“”]+|[.,!?;:)("'“”]+$/g, "").trim();
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function tokenize(idea: string) {
  return unique(
    idea
      .toLowerCase()
      .split(/\s+/)
      .map(stripPunctuation)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
}

function detectDomain(idea: string): Domain {
  const lowerIdea = idea.toLowerCase();
  let best: { domain: Domain; score: number } = { domain: "interdisciplinary", score: 0 };
  for (const rule of DOMAIN_RULES) {
    const score = rule.terms.reduce((total, term) => total + (lowerIdea.includes(term) ? 1 : 0), 0);
    if (score > best.score) best = { domain: rule.domain, score };
  }
  return best.domain;
}

function inferSubject(idea: string, tokens: string[]) {
  const lowerIdea = idea.toLowerCase();
  const normalizedIdea = lowerIdea.replace(/[’']/g, "").replace(/\bparkinsons\b/g, "parkinson");
  const knownSubjects = [
    "parkinson disease",
    "parkinsons disease",
    "asthma",
    "sickle cell disease",
    "diabetes",
    "breast cancer",
    "air pollution",
    "climate change",
  ];
  const known = knownSubjects.find((subject) => normalizedIdea.includes(subject));
  if (known) return titleCase(known.replace("parkinson disease", "parkinson's disease"));
  const phraseMatches = [
    lowerIdea.match(/\b(?:how does|does)\s+(.+?)\s+(?:affect|impact|influence)\b/i)?.[1],
    lowerIdea.match(/\b(?:of|about|on)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*){0,4}?)(?=\s+(?:from|in|among|using|with|after|before|and|to)\b|[?.!,]|$)/i)?.[1],
    lowerIdea.match(/\b(?:diagnos(?:e|is)|detect|treat(?:ment)?|study|research)\s+(?:of|for|on)?\s*([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*){0,4}?)(?=\s+(?:from|in|among|using|with|after|before|and|to)\b|[?.!,]|$)/i)?.[1],
  ];
  const phrase = phraseMatches.find((candidate) => candidate && candidate.length > 3);
  return titleCase(stripPunctuation(phrase ?? tokens.slice(0, 4).join(" "))) || "To be defined";
}

function extractPopulation(idea: string) {
  const lowerIdea = idea.toLowerCase();
  const patterns: Array<[RegExp, string]> = [
    [/\b(?:in|among)\s+(children|adolescents|teenagers|older adults|adults|older people)\b/i, "$1"],
    [/\b(?:in|among)\s+([a-z][a-z-]*(?:\s+[a-z][a-z-]*){0,2})\s+(?:with|who)\b/i, "$1"],
    [/\b(?:medical students|university students|college students|teachers|patients|caregivers)\b/i, "$&"],
  ];
  for (const [pattern, value] of patterns) {
    const match = lowerIdea.match(pattern);
    if (match) return titleCase(value === "$&" ? match[0] : match[1]);
  }
  const broadPopulation = lowerIdea.match(/\b(?:in|among)\s+([a-z][a-z-]*(?:\s+[a-z][a-z-]*){0,3})[?.!,]*$/i)?.[1];
  if (broadPopulation) return titleCase(broadPopulation);
  return "To be defined";
}

function extractQuestion(idea: string): ResearchQuestion {
  const lowerIdea = idea.toLowerCase();
  const tokens = tokenize(idea);
  const effectMatch = lowerIdea.match(/\b(?:how does|does)\s+(.+?)\s+(?:affect|impact|influence)\s+(.+?)(?:\s+\b(?:in|among|for)\s+([a-z][a-z-]*(?:\s+[a-z][a-z-]*){0,3}))?[?.!,]*$/i);
  const subject = inferSubject(idea, tokens);
  const population = extractPopulation(idea);
  const isDetection = /(detect|diagnos|screen|classif|identify)/.test(lowerIdea);
  const isTreatment = /(treat|therapy|intervention|drug|vaccine|crispr|gene edit)/.test(lowerIdea);
  const isEffect = /(effect|impact|association|relationship|relat|influence)/.test(lowerIdea);
  const technology = /(artificial intelligence|machine learning|\bai\b|algorithm|deep learning)/.test(lowerIdea)
    ? "Artificial intelligence / machine learning"
    : /(crispr|gene edit)/.test(lowerIdea)
      ? "CRISPR-based gene editing"
      : /(air pollution|pm2.5|nitrogen dioxide)/.test(lowerIdea)
        ? "Ambient air pollution exposure"
        : isTreatment
          ? "Treatment or intervention"
          : "To be defined";
  const researchTask = isDetection
    ? "Detection / diagnosis"
    : isTreatment
      ? "Treatment or intervention evaluation"
      : isEffect
        ? "Exposure–outcome association"
        : "Research task to be defined";
  const extractedOutcome = effectMatch?.[2] ? titleCase(stripPunctuation(effectMatch[2])) : undefined;
  const outcome = extractedOutcome ?? (isDetection
    ? "Diagnostic/detection performance"
    : /(asthma|symptom|health outcome)/.test(lowerIdea)
      ? "Health symptoms or clinical events"
      : isTreatment
        ? "Treatment response and safety"
        : "To be defined");
  const extractedExposure = effectMatch?.[1] ? titleCase(stripPunctuation(effectMatch[1])) : undefined;
  const exposure = technology === "To be defined" ? extractedExposure ?? "Primary exposure or intervention to be defined" : technology;
  const topic = subject === "To be defined" ? titleCase(tokens.slice(0, 6).join(" ")) : subject;
  const keywords = unique([topic, technology, ...tokens]).filter(
    (keyword) => !["To be defined", "Treatment or intervention"].includes(keyword),
  );
  const refinedQuestion = isDetection
    ? `In ${population === "To be defined" ? "a target population to be defined" : population.toLowerCase()}, how accurately can ${technology === "To be defined" ? "the proposed approach" : technology.toLowerCase()} detect or diagnose ${subject.toLowerCase()}?`
    : isTreatment
      ? `Among ${population === "To be defined" ? "a population to be defined" : population.toLowerCase()}, what response and safety outcomes follow the proposed treatment for ${subject.toLowerCase()}?`
        : isEffect
        ? `Among ${population === "To be defined" ? "a population to be defined" : population.toLowerCase()}, how is ${exposure.toLowerCase()} associated with ${outcome === "To be defined" ? "the outcome to be defined" : outcome.toLowerCase()}?`
        : "The research question needs a clearer task, population, and outcome before it can be refined.";

  return {
    originalIdea: idea,
    refinedQuestion,
    topic,
    subject,
    technology,
    researchTask,
    population,
    exposure,
    outcome,
    researchType: isDetection
      ? "Diagnostic accuracy / model evaluation"
      : isTreatment
        ? "Interventional or treatment evaluation"
        : isEffect
          ? "Observational exposure–outcome research"
          : "Exploratory research design to be defined",
    keyConcepts: unique([subject, technology, researchTask, outcome, ...tokens]).slice(0, 8),
    keywords: keywords.slice(0, 12),
  };
}

function isTooBroad(idea: string, question: ResearchQuestion) {
  const tokens = tokenize(idea);
  const broadTerms = new Set(["health", "technology", "education", "business", "biology", "science", "research", "society"]);
  return (
    tokens.length < 3 ||
    (tokens.length <= 4 && tokens.some((token) => broadTerms.has(token))) ||
    question.subject === "To be defined"
  );
}

function sourceProviders(domain: Domain) {
  if (["medicine", "biology", "psychology"].includes(domain)) {
    return ["Europe PMC", "OpenAlex"];
  }
  if (domain === "computer science / AI") return ["OpenAlex", "Crossref"];
  return ["OpenAlex", "Crossref"];
}

function createSearchQuery(question: ResearchQuestion) {
  return unique([question.topic, question.subject, question.technology, question.researchTask, ...question.keywords])
    .filter((term) => term !== "To be defined")
    .slice(0, 8)
    .join(" ");
}

function authorString(authors: Array<{ author?: { display_name?: string }; name?: string }> | undefined) {
  return (
    authors
      ?.map((author) => author.author?.display_name ?? author.name)
      .filter(Boolean)
      .slice(0, 6)
      .join(" · ") || "Authors not provided in source record"
  );
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "MIDAS research navigator prototype" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<Record<string, unknown>>;
}

async function searchEuropePmc(query: string): Promise<SourceRecord[]> {
  const url = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  url.searchParams.set("query", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("pageSize", "8");
  url.searchParams.set("resultType", "core");
  const data = await fetchJson(url.toString());
  const results = (data.resultList as { result?: Array<Record<string, unknown>> } | undefined)?.result ?? [];
  return results.flatMap((item) => {
    const pmid = typeof item.pmid === "string" ? item.pmid : typeof item.id === "string" ? item.id : undefined;
    if (!pmid || typeof item.title !== "string") return [];
    const doi = typeof item.doi === "string" ? item.doi : undefined;
    return [
      {
        source: "Europe PMC",
        sourceUrl: doi ? `https://doi.org/${doi}` : `https://europepmc.org/article/MED/${pmid}`,
        title: item.title,
        authors: typeof item.authorString === "string" ? item.authorString : "Authors not provided in source record",
        year: typeof item.pubYear === "number" ? item.pubYear : Number(item.pubYear) || null,
        doi,
        identifier: `PMID:${pmid}`,
        abstract: typeof item.abstractText === "string" ? item.abstractText : undefined,
        studyType: typeof item.articleType === "string" ? item.articleType : "Scholarly article",
        area: typeof item.journalTitle === "string" ? item.journalTitle : "Europe PMC",
      },
    ];
  });
}

async function searchOpenAlex(query: string): Promise<SourceRecord[]> {
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", query);
  url.searchParams.set("per-page", "8");
  url.searchParams.set("mailto", "midas-research-navigator@replit.com");
  const data = await fetchJson(url.toString());
  const results = Array.isArray(data.results) ? (data.results as Array<Record<string, unknown>>) : [];
  return results.flatMap((item) => {
    const id = typeof item.id === "string" ? item.id : undefined;
    const title = typeof item.title === "string" ? item.title : undefined;
    if (!id || !title) return [];
    const doi = typeof item.doi === "string" ? item.doi.replace("https://doi.org/", "") : undefined;
    const primaryLocation = item.primary_location as { landing_page_url?: string; source?: { display_name?: string } } | undefined;
    const openAccess = item.open_access as { oa_url?: string } | undefined;
    return [
      {
        source: "OpenAlex",
        sourceUrl: doi ? `https://doi.org/${doi}` : openAccess?.oa_url ?? primaryLocation?.landing_page_url ?? id,
        title,
        authors: authorString(item.authorships as Array<{ author?: { display_name?: string } }> | undefined),
        year: typeof item.publication_year === "number" ? item.publication_year : null,
        doi,
        identifier: `OpenAlex:${id.split("/").pop()}`,
        abstract: undefined,
        studyType: typeof item.type === "string" ? item.type : "Scholarly work",
        area: primaryLocation?.source?.display_name ?? "OpenAlex",
      },
    ];
  });
}

async function searchCrossref(query: string): Promise<SourceRecord[]> {
  const url = new URL("https://api.crossref.org/works");
  url.searchParams.set("query.bibliographic", query);
  url.searchParams.set("rows", "8");
  url.searchParams.set("select", "DOI,title,author,published,URL,container-title,type");
  const data = await fetchJson(url.toString());
  const message = data.message as { items?: Array<Record<string, unknown>> } | undefined;
  return (message?.items ?? []).flatMap((item) => {
    const doi = typeof item.DOI === "string" ? item.DOI : undefined;
    const title = Array.isArray(item.title) && typeof item.title[0] === "string" ? item.title[0] : undefined;
    if (!doi || !title) return [];
    const published = item.published as { "date-parts"?: number[][] } | undefined;
    const year = published?.["date-parts"]?.[0]?.[0] ?? null;
    const container = Array.isArray(item["container-title"]) && typeof item["container-title"][0] === "string"
      ? item["container-title"][0]
      : "Crossref";
    return [
      {
        source: "Crossref",
        sourceUrl: typeof item.URL === "string" ? item.URL : `https://doi.org/${doi}`,
        title,
        authors: authorString(item.author as Array<{ name?: string }> | undefined),
        year,
        doi,
        identifier: `DOI:${doi}`,
        studyType: typeof item.type === "string" ? item.type : "Scholarly work",
        area: container,
      },
    ];
  });
}

async function retrieveSources(query: string, providers: string[]) {
  const searches: Record<string, () => Promise<SourceRecord[]>> = {
    "Europe PMC": () => searchEuropePmc(query),
    OpenAlex: () => searchOpenAlex(query),
    Crossref: () => searchCrossref(query),
  };
  const settled = await Promise.allSettled(providers.map((provider) => searches[provider]()));
  const records = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const errors = settled.flatMap((result, index) =>
    result.status === "rejected" ? [`${providers[index]}: ${result.reason instanceof Error ? result.reason.message : "request failed"}`] : [],
  );
  const seen = new Set<string>();
  const deduped = records.filter((record) => {
    const key = (record.doi ?? record.title).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { records: deduped.slice(0, 12), errors };
}

function toLiteratureItem(record: SourceRecord, question: ResearchQuestion): LiteratureItem {
  const summary = record.abstract
    ? record.abstract.replace(/\s+/g, " ").slice(0, 420) + (record.abstract.length > 420 ? "…" : "")
    : "Abstract not provided in the source record.";
  return {
    id: record.identifier ?? record.doi ?? record.sourceUrl,
    title: record.title,
    authors: record.authors,
    year: record.year,
    studyType: record.studyType ?? "Scholarly work",
    area: record.area ?? question.topic,
    summary,
    relevance: `Retrieved because the record matched the topic terms for ${question.topic}. Read the original source before relying on it.`,
    source: record.source,
    sourceUrl: record.sourceUrl,
    doi: record.doi,
    identifier: record.identifier,
  };
}

function buildGuidance(question: ResearchQuestion, domain: Domain, literature: LiteratureItem[], sourceErrors: string[]) {
  const anchor = literature[0]?.title ?? "No matching source record was returned";
  const topic = question.topic;
  const population = question.population;
  const evidenceNote = literature.length
    ? `Use the retrieved records as a starting set; the strongest evidence and gaps still need full-text review for ${topic}.`
    : `No source records were returned for ${topic}; narrow the query or try again before making a literature-based decision.`;
  const commonMethodologies = [
    {
      id: "focused-observational",
      name: domain === "medicine" || domain === "environmental science" ? "Focused observational study" : "Focused empirical study",
      fit: `A possible design for studying ${topic} with ${population.toLowerCase()} once the variables and comparison are specified.`,
      advantages: ["Can reflect the setting of interest", "Makes the population and measures explicit", "Can be scoped for a first study"],
      limitations: ["Confounding or selection bias may remain", "Needs a precise outcome definition", "Findings may not generalize beyond the sampled setting"],
    },
    {
      id: "prospective-validation",
      name: "Prospective validation or follow-up",
      fit: `A useful option if the retrieved evidence suggests that timing, validation, or change over time matters for ${topic}.`,
      advantages: ["Clarifies temporal sequence", "Tests feasibility in the intended setting", "Supports repeated measurement"],
      limitations: ["Requires retention and a longer timeline", "Missing follow-up can bias results", "Needs a prespecified analysis plan"],
    },
    {
      id: "review-or-synthesis",
      name: "Structured evidence synthesis",
      fit: `A defensible next step when the goal is to map what is known about ${topic} and identify a focused gap.`,
      advantages: ["Makes the evidence landscape visible", "Can compare definitions and methods", "Useful before primary data collection"],
      limitations: ["Search and screening decisions affect conclusions", "Source quality varies", "Does not replace primary evidence"],
    },
  ];
  const variables = [
    { name: question.exposure, type: "To be defined", role: "Primary exposure, intervention, or predictor" },
    { name: question.outcome, type: "To be defined", role: "Primary outcome" },
    { name: population, type: "Categorical / eligibility rule", role: "Target population" },
    { name: "Potential confounders from retrieved evidence", type: "To be defined", role: "Adjustment candidates" },
  ];
  const roadmap: RoadmapItem[] = [
    { stepId: "research-question", title: "Research question", focus: `Refine ${question.refinedQuestion}`, actions: [`Define what ${topic} means in this project`, `Replace any remaining “To be defined” field before collecting data`], evidenceAnchor: anchor },
    { stepId: "planning", title: "Planning", focus: `Set boundaries around ${question.subject} and ${question.population.toLowerCase()}.`, actions: ["Write eligibility and exclusion criteria", "Choose the smallest useful population and outcome"], evidenceAnchor: anchor },
    { stepId: "literature-review", title: "Literature search", focus: `Search across ${domain} sources using the retrieved terms and their synonyms.`, actions: [`Screen the ${literature.length} retrieved records for direct relevance`, "Record inclusion decisions and search dates"], evidenceAnchor: anchor },
    { stepId: "methodology", title: "Relevant evidence and gaps", focus: evidenceNote, actions: ["Compare designs and measures in the original sources", "Write the unresolved gap without overstating what the records show"], evidenceAnchor: anchor },
    { stepId: "instruments", title: "Methodology / study design", focus: `Choose a design that can answer the ${question.researchTask.toLowerCase()} question.`, actions: ["Define the comparison or reference standard", "Pre-specify the primary outcome and timing"], evidenceAnchor: anchor },
    { stepId: "ethics", title: "Instruments / data requirements", focus: `Select measures that are valid and feasible for ${population.toLowerCase()}.`, actions: ["Verify instruments against original validation evidence", "Document device, assay, questionnaire, or coding requirements"], evidenceAnchor: anchor },
    { stepId: "data-collection", title: "Ethics and data collection", focus: `Plan responsible collection for ${topic}.`, actions: ["Identify consent, privacy, and data-governance needs", "Define recruitment, storage, quality checks, and missing-data handling"], evidenceAnchor: anchor },
    { stepId: "data-analysis", title: "Analysis", focus: `Match analysis to the design, measures, and evidence gap for ${topic}.`, actions: ["Create a variable map", "Write a prespecified descriptive and inferential analysis plan"], evidenceAnchor: anchor },
    { stepId: "manuscript-writing", title: "Writing", focus: `Write the contribution around the question, evidence gap, and limits.`, actions: ["Separate retrieved findings from MIDAS planning guidance", "Report search methods and uncertainty transparently"], evidenceAnchor: anchor },
    { stepId: "journal-selection", title: "Journal selection", focus: `Shortlist venues that publish ${domain} work on ${topic}.`, actions: ["Check aims, scope, article type, and current author guidance", "Compare the venue with the original sources you cited"], evidenceAnchor: anchor },
    { stepId: "publication", title: "Publication", focus: `Prepare a transparent submission that lets readers trace the evidence behind ${topic}.`, actions: ["Confirm references, data statements, ethics statements, and disclosures", "Use the journal’s current submission instructions"], evidenceAnchor: anchor },
  ];

  return {
    evidence: {
      sourceCount: literature.length,
      summary: evidenceNote,
      gaps: [
        literature.length ? `The returned records need full-text screening to determine what is genuinely known about ${topic}.` : `The search returned no records; the first gap is a narrower, testable search question for ${topic}.`,
        `Population, outcome, and study-design definitions vary across research on ${topic}; compare them before combining conclusions.`,
        ...(sourceErrors.length ? [`Some providers were unavailable during this search: ${sourceErrors.join("; ")}.`] : []),
      ],
      caveat: "Retrieved metadata and abstracts are evidence leads, not a complete systematic review. Follow each source link and verify the original work.",
    },
    methodologies: commonMethodologies,
    instruments: [
      {
        id: "primary-outcome-measure",
        name: `Primary measure for ${question.outcome}`,
        measures: `A validated measure of ${question.outcome.toLowerCase()} to be selected from the retrieved evidence.`,
        population,
        validationStatus: "To be verified against the original instrument or measurement paper",
        source: "Use the source record and its cited validation evidence",
      },
      {
        id: "exposure-measure",
        name: `Measure for ${question.exposure}`,
        measures: `Operational definition of ${question.exposure.toLowerCase()} in the chosen setting.`,
        population,
        validationStatus: "Define timing, thresholds, reliability, and missing-data rules",
        source: "Use the source record methods and domain standards",
      },
    ],
    ethics: {
      considerations: [
        `Consent and participant information must match the risks of researching ${topic}.`,
        "Collect the minimum identifiable or sensitive data needed for the question.",
        `Check whether ${population.toLowerCase()} requires additional safeguards or accessible study materials.`,
        "Define secure storage, access, retention, deletion, and data-sharing boundaries.",
        "Obtain the institutional, legal, or governance review required in the study setting.",
      ],
      disclaimer: "MIDAS guidance is educational planning support, not ethics approval, legal advice, clinical advice, or regulatory approval.",
    },
    dataCollection: {
      participants: population,
      variables: [question.exposure, question.outcome, "Eligibility and participant characteristics to be defined", "Data quality and missingness indicators"],
      methods: ["Use the measurement procedure supported by the retrieved evidence", "Pilot the collection workflow", "Record protocol deviations and missingness", "Securely document source and collection dates"],
      inclusion: ["Matches the written population and study setting", "Meets consent or permission requirements", "Has the minimum data needed for the primary analysis"],
      exclusion: ["Fails prespecified eligibility criteria", "Has unusable or missing primary measures", "Would create a safety, privacy, or data-quality concern"],
    },
    analysis: {
      variables,
      descriptive: ["Participant or record flow", "Distribution of exposures, interventions, and outcomes", "Missing-data and quality summary", "Comparison of included and excluded records where appropriate"],
      statistical: ["Choose descriptive summaries for each measurement scale", "Select association, comparison, prediction, or synthesis methods after the design is fixed", "Run sensitivity analyses for important definitions and assumptions"],
      note: "A qualified researcher should review the final analysis against the design, measurement validity, sampling, missingness, and assumptions before interpretation.",
    },
    journals: [
      { name: `${domain} journal to shortlist`, area: domain, reason: `Use the retrieved sources to identify journals that publish the population, method, and topic combination for ${topic}.`, relevanceScore: 60 },
      { name: "Journal identified from the strongest retrieved sources", area: topic, reason: "Compare where the most relevant original records were published, then verify scope and author requirements directly.", relevanceScore: 52 },
    ],
    beginnerMistakes: [
      { title: "Treating search results as a conclusion", detail: "A relevance-ranked record is a lead. Read the original methods, population, results, and limitations." },
      { title: "Leaving the outcome vague", detail: `Turn “${question.outcome}” into one measurable primary outcome before choosing a design.` },
      { title: "Overlooking source differences", detail: "Do not combine studies with different populations, definitions, or measures without explaining the differences." },
      { title: "Confusing guidance with evidence", detail: "MIDAS planning suggestions are separate from retrieved source claims and need expert review." },
      { title: "Making a claim the data cannot support", detail: "Match causal, diagnostic, predictive, or descriptive language to the actual design and evidence." },
    ],
    roadmap,
  };
}

export async function processResearchIdea(idea: string): Promise<ResearchProcessingResponse> {
  const originalIdea = cleanIdea(idea);
  if (!originalIdea) {
    return {
      needsNarrowing: true,
      message: "Enter a research idea with a subject, task, or outcome so MIDAS can search it.",
      suggestions: ["Name the subject or condition", "Add what you want to study about it", "Add a population or outcome if you know it"],
    };
  }

  const question = extractQuestion(originalIdea);
  if (isTooBroad(originalIdea, question)) {
    return {
      needsNarrowing: true,
      message: "This idea is too broad for a trustworthy literature search yet.",
      suggestions: ["Name a specific subject or condition", "Add a research task such as effect, detection, comparison, or treatment", "Add a population, setting, or measurable outcome"],
    };
  }

  const domain = detectDomain(originalIdea);
  const providers = sourceProviders(domain);
  const query = createSearchQuery(question);
  const retrieved = await retrieveSources(query, providers);
  const literature = retrieved.records.map((record) => toLiteratureItem(record, question));
  const guidance = buildGuidance(question, domain, literature, retrieved.errors);
  return {
    question,
    domain,
    sourcePlan: {
      providers,
      query,
      retrievedAt: new Date().toISOString(),
      note: "Records below are retrieved from the named scholarly providers. MIDAS guidance is generated separately from the structured question and search results.",
    },
    literature,
    ...guidance,
    searchStrategy: {
      keywords: question.keywords,
      booleanQuery: question.keywords.length > 1 ? question.keywords.map((keyword) => `"${keyword}"`).join(" AND ") : `"${question.topic}"`,
      databases: providers,
    },
  };
}
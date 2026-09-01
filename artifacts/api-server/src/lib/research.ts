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
  researchQuestion: string;
  refinedQuestion: string;
  domain: Domain;
  subdomain: string;
  topic: string;
  subject: string;
  researchObjective: string;
  technology: string;
  dataType: string;
  researchTask: string;
  population: string;
  exposure: string;
  outcome: string;
  researchType: string;
  keyConcepts: string[];
  keywords: string[];
  clarifications: string[];
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
  journalUrl?: string;
  doi?: string;
  identifier?: string;
  relevanceTier: "Directly relevant" | "Highly relevant" | "Methodologically relevant" | "Background";
  relevanceScore: number;
  relevanceReason: string;
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
    source: string;
    evidence: string;
    originalJournalLink: string;
    relevanceScore: number | null;
  }>;
  journalSelectionNote: string;
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
  journalUrl?: string;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "be",
  "by",
  "can",
  "about",
  "after",
  "among",
  "before",
  "could",
  "does",
  "evaluate",
  "how",
  "whether",
  "detect",
  "diagnose",
  "analyze",
  "does",
  "early",
  "effect",
  "for",
  "from",
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
    terms: ["climate", "pollution", "air quality", "water", "soil", "environment", "biodiversity", "emission", "temperature", "urban heat", "tree", "canopy", "green space", "microplastic", "marine", "ecosystem", "ocean"],
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
    "microplastics",
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

function inferDataType(idea: string, domain: Domain) {
  const lowerIdea = idea.toLowerCase();
  if (/(mammograph|mammogram)/.test(lowerIdea)) return "Mammography images";
  if (/(speech pattern|voice|speech|audio recording)/.test(lowerIdea)) return "Speech or voice recordings";
  if (/\bmicrop?lastics?\b|marine ecosystems?|ocean|sea water|sediment/.test(lowerIdea)) return "Environmental samples and marine ecosystem observations";
  if (/(image|imaging|photograph|scan)/.test(lowerIdea)) return "Images or scans";
  if (/(electronic health record|ehr|medical record)/.test(lowerIdea)) return "Electronic health records";
  if (/(genomic|genome|dna|rna|sequenc)/.test(lowerIdea)) return "Genomic or sequencing data";
  if (/(sensor|wearable|accelerometer|satellite)/.test(lowerIdea)) return "Sensor or remote-sensing data";
  if (/(survey|questionnaire|interview)/.test(lowerIdea)) return "Survey, questionnaire, or interview data";
  if (domain === "environmental science") return "Environmental observations or samples to be defined";
  return "To be defined";
}

function inferSubdomain(idea: string, domain: Domain, dataType: string) {
  const lowerIdea = idea.toLowerCase();
  if (/(mammograph|mammogram|breast cancer|medical imaging)/.test(lowerIdea)) return "Medical imaging and diagnostic AI";
  if (/(parkinson|neurolog|speech|voice)/.test(lowerIdea) && domain === "medicine") return "Neurology and speech analysis";
  if (/\bmicrop?lastics?\b|marine ecosystems?|ocean|coral reefs?|\bsea\b/.test(lowerIdea)) return "Marine ecology and environmental pollution";
  if (dataType !== "To be defined" && domain === "computer science / AI") return "Applied machine learning";
  if (domain === "environmental science") return "Environmental exposure and ecosystem science";
  if (domain === "biology") return "Molecular and cellular biology";
  return `${domain} research`;
}

function clarificationList(question: {
  population: string;
  outcome: string;
  dataType: string;
  researchTask: string;
  technology: string;
}) {
  const missing: string[] = [];
  if (question.population === "To be defined") missing.push("target population or study setting");
  if (question.outcome === "To be defined") missing.push("measurable primary outcome");
  if (question.dataType === "To be defined") missing.push("data type and measurement source");
  if (question.researchTask === "Research task to be defined") missing.push("research objective and task");
  if (question.technology === "To be defined") missing.push("technology, intervention, or exposure definition");
  return missing;
}

function extractQuestion(idea: string): ResearchQuestion {
  const lowerIdea = idea.toLowerCase();
  const tokens = tokenize(idea);
  const effectMatch = lowerIdea.match(/\b(?:how does|does)\s+(.+?)\s+(?:affect|impact|influence)\s+(.+?)(?:\s+\b(?:in|among|for)\s+([a-z][a-z-]*(?:\s+[a-z][a-z-]*){0,3}))?[?.!,]*$/i);
  const domain = detectDomain(idea);
  const subject = inferSubject(idea, tokens);
  const parsedPopulation = extractPopulation(idea);
  const dataType = inferDataType(idea, domain);
  const isDetection = /(detect|diagnos|screen|classif|identify)/.test(lowerIdea);
  const isTreatment = /(treat|therapy|intervention|drug|vaccine|crispr|gene edit)/.test(lowerIdea);
  const isEcologyRelationship = /\bmicrop?lastics?\b|marine ecosystems?|ocean|coral reefs?|\bsea\b/.test(lowerIdea);
  const population = isEcologyRelationship ? "Marine ecosystems" : parsedPopulation;
  const isEffect = /(effect|impact|association|relationship|relat|influence)/.test(lowerIdea) || Boolean(effectMatch) || isEcologyRelationship;
  const technology = /(artificial intelligence|machine learning|\bai\b|algorithm|deep learning)/.test(lowerIdea)
    ? "Artificial intelligence / machine learning"
    : /(crispr|gene edit)/.test(lowerIdea)
      ? "CRISPR-based gene editing"
      : /(air pollution|pm2.5|nitrogen dioxide)/.test(lowerIdea)
        ? "Ambient air pollution exposure"
        : isEcologyRelationship
          ? "Microplastics exposure"
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
      : isEcologyRelationship
        ? "Marine ecosystem health and ecological indicators"
      : isTreatment
        ? "Treatment response and safety"
        : "To be defined");
  const extractedExposure = effectMatch?.[1] ? titleCase(stripPunctuation(effectMatch[1])) : undefined;
  const exposure = technology === "To be defined" ? extractedExposure ?? "Primary exposure or intervention to be defined" : technology;
  const topic = isEcologyRelationship ? "Microplastics and marine ecosystems" : subject === "To be defined" ? titleCase(tokens.slice(0, 6).join(" ")) : subject;
  const researchObjective = isDetection
    ? `Evaluate whether ${technology.toLowerCase()} can detect or diagnose ${topic.toLowerCase()} using ${dataType.toLowerCase()}.`
    : isTreatment
      ? `Evaluate the response, safety, or feasibility of the proposed treatment for ${topic.toLowerCase()}.`
      : isEffect
        ? `Characterize how ${exposure.toLowerCase()} relates to ${outcome === "To be defined" ? "a measurable outcome" : outcome.toLowerCase()} in ${population.toLowerCase()}.`
        : `Explore ${topic.toLowerCase()} while defining a testable objective.`;
  const subdomain = inferSubdomain(idea, domain, dataType);
  const clarifications = clarificationList({ population, outcome, dataType, researchTask, technology });
  const keywords = unique([topic, subdomain, technology, dataType, population, outcome, ...tokens]).filter(
    (keyword) => !["To be defined", "Treatment or intervention"].includes(keyword),
  );

  return {
    originalIdea: idea,
    researchQuestion: idea,
    refinedQuestion: idea,
    domain,
    subdomain,
    topic,
    subject,
    researchObjective,
    technology,
    dataType,
    researchTask,
    population,
    exposure,
    outcome,
    researchType: isDetection
      ? technology === "Artificial intelligence / machine learning"
        ? "AI model development, validation, and diagnostic-performance evaluation"
        : "Diagnostic accuracy / model evaluation"
      : isTreatment
        ? "Interventional or treatment evaluation"
        : isEffect
          ? "Observational exposure–outcome research"
          : "Exploratory research design to be defined",
    keyConcepts: unique([subject, subdomain, technology, dataType, researchTask, outcome, ...tokens]).slice(0, 12),
    keywords: keywords.slice(0, 12),
    clarifications,
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
  return unique([
    question.domain,
    question.subdomain,
    question.topic,
    question.subject,
    question.researchObjective,
    question.technology,
    question.dataType,
    question.population,
    question.outcome,
    question.researchTask,
    ...question.keyConcepts,
  ])
    .filter((term) => term !== "To be defined")
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
    const journalInfo = item.journalInfo as { journal?: { title?: string; ISSN?: string; issn?: string } } | undefined;
    const issn = journalInfo?.journal?.ISSN ?? journalInfo?.journal?.issn;
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
        area: typeof item.journalTitle === "string" ? item.journalTitle : journalInfo?.journal?.title ?? "Europe PMC",
        journalUrl: issn ? `https://europepmc.org/journal/${issn}` : undefined,
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
  const sourceIds = unique(
    results
      .map((item) => (item.primary_location as { source?: { id?: string } } | undefined)?.source?.id)
      .filter((id): id is string => Boolean(id)),
  ).slice(0, 8);
  const sourceHomepages = new Map<string, string>();
  const sourceDetails = await Promise.allSettled(
    sourceIds.map((sourceId) => fetchJson(sourceId.replace("https://openalex.org/", "https://api.openalex.org/sources/"))),
  );
  sourceDetails.forEach((detail, index) => {
    if (detail.status === "fulfilled" && typeof detail.value.homepage_url === "string") {
      sourceHomepages.set(sourceIds[index], detail.value.homepage_url);
    }
  });
  return results.flatMap((item) => {
    const id = typeof item.id === "string" ? item.id : undefined;
    const title = typeof item.title === "string" ? item.title : undefined;
    if (!id || !title) return [];
    const doi = typeof item.doi === "string" ? item.doi.replace("https://doi.org/", "") : undefined;
    const primaryLocation = item.primary_location as { landing_page_url?: string; source?: { id?: string; display_name?: string; homepage_url?: string } } | undefined;
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
        journalUrl: primaryLocation?.source?.homepage_url ?? (primaryLocation?.source?.id ? sourceHomepages.get(primaryLocation.source.id) : undefined),
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

const RELEVANCE_TIERS = {
  direct: "Directly relevant",
  high: "Highly relevant",
  method: "Methodologically relevant",
  background: "Background",
} as const;

function searchableTerms(value: string) {
  return unique(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s/-]/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2 && !STOP_WORDS.has(term)),
  );
}

function scoreRecord(record: SourceRecord, question: ResearchQuestion) {
  const titleText = record.title.toLowerCase();
  const searchableText = `${record.title} ${record.abstract ?? ""} ${record.area ?? ""}`.toLowerCase();
  const searchableTokens = new Set(searchableTerms(searchableText));
  const matches: string[] = [];
  let score = 0;

  const scoreField = (label: string, value: string, weight: number) => {
    if (value === "To be defined") return;
    const fieldTerms = searchableTerms(value);
    const matchedTerms = fieldTerms.filter((term) => term.includes(" ") ? searchableText.includes(term) : searchableTokens.has(term));
    const phraseMatch = value.length > 4 && searchableText.includes(value.toLowerCase());
    if (phraseMatch || matchedTerms.length >= Math.max(1, Math.ceil(fieldTerms.length * 0.4))) {
      score += phraseMatch ? weight : Math.round(weight * Math.min(1, matchedTerms.length / Math.max(1, fieldTerms.length)));
      matches.push(label);
    }
  };

  scoreField("topic", question.topic, 24);
  scoreField("objective", question.researchObjective, 14);
  scoreField("technology/intervention/exposure", question.technology !== "To be defined" ? question.technology : question.exposure, 18);
  scoreField("data type", question.dataType, 18);
  scoreField("population", question.population, 10);
  scoreField("outcome", question.outcome, 12);
  scoreField("research task", question.researchTask, 12);
  const conceptMatches = question.keyConcepts.filter((concept) => searchableText.includes(concept.toLowerCase())).length;
  if (conceptMatches) {
    score += Math.min(12, conceptMatches * 3);
    matches.push("key concepts");
  }
  const methodTerms = ["validation", "diagnostic", "sensitivity", "specificity", "accuracy", "cohort", "survey", "sampling", "assay", "model", "classification", "ecosystem", "exposure"];
  const methodMatches = methodTerms.filter((term) => searchableText.includes(term)).length;
  if (methodMatches) score += Math.min(8, methodMatches * 2);

  const normalizedScore = Math.max(0, Math.min(100, score));
  const tier = normalizedScore >= 70
    ? RELEVANCE_TIERS.direct
    : normalizedScore >= 50
      ? RELEVANCE_TIERS.high
      : normalizedScore >= 30
        ? RELEVANCE_TIERS.method
        : RELEVANCE_TIERS.background;
  return {
    score: normalizedScore,
    tier,
    matches: unique(matches),
  };
}

function toLiteratureItem(record: SourceRecord, question: ResearchQuestion, ranking: ReturnType<typeof scoreRecord>): LiteratureItem {
  const summary = record.abstract
    ? record.abstract.replace(/\s+/g, " ").slice(0, 420) + (record.abstract.length > 420 ? "…" : "")
    : "Abstract not provided in the source record.";
  const matchText = ranking.matches.length ? ranking.matches.join(", ") : "limited structured-field overlap";
  const relevanceReason = `${ranking.tier} because the record matched ${matchText} in the complete research representation. This ranking is a screening aid; verify the original paper.`;
  return {
    id: record.identifier ?? record.doi ?? record.sourceUrl,
    title: record.title,
    authors: record.authors,
    year: record.year,
    studyType: record.studyType ?? "Scholarly work",
    area: record.area ?? question.topic,
    summary,
    relevance: relevanceReason,
    source: record.source,
    sourceUrl: record.sourceUrl,
    journalUrl: record.journalUrl,
    doi: record.doi,
    identifier: record.identifier,
    relevanceTier: ranking.tier,
    relevanceScore: ranking.score,
    relevanceReason,
  };
}

function derivePotentialGaps(question: ResearchQuestion, literature: LiteratureItem[]) {
  if (!literature.length) {
    return [`Potential gap: no scholarly records were returned for the complete representation of ${question.topic}. Verify the query and narrow it before claiming a gap.`];
  }
  const searchable = literature.map((item) => `${item.title} ${item.summary} ${item.area}`.toLowerCase());
  const countMatches = (value: string) =>
    value === "To be defined" ? 0 : searchable.filter((text) => searchableTerms(value).some((term) => text.includes(term))).length;
  const gaps = [
    `Potential gap: ${countMatches(question.dataType)} of ${literature.length} retrieved records explicitly mention the proposed data type (${question.dataType}); verify full-text methods before concluding that it is under-studied.`,
    `Potential gap: ${countMatches(question.population)} of ${literature.length} retrieved records explicitly mention the target population (${question.population}); check eligibility and subgroup coverage in the original papers.`,
    `Potential gap: ${countMatches(question.outcome)} of ${literature.length} retrieved records explicitly mention the intended outcome (${question.outcome}); compare outcome definitions before synthesizing findings.`,
  ];
  if (literature.filter((item) => item.relevanceTier === "Directly relevant").length === 0) {
    gaps.push("Potential gap: no returned record crossed the direct-relevance threshold for all available fields; screen additional sources and full text before designing the study.");
  }
  return gaps;
}

function buildJournalRecommendations(question: ResearchQuestion, literature: LiteratureItem[]) {
  const grouped = new Map<string, LiteratureItem[]>();
  for (const paper of literature) {
    if (paper.relevanceScore < 30 || !paper.area || !paper.journalUrl || ["OpenAlex", "Europe PMC", "Crossref"].includes(paper.area)) continue;
    const current = grouped.get(paper.area) ?? [];
    current.push(paper);
    grouped.set(paper.area, current);
  }
  const journals = Array.from(grouped.entries())
    .map(([name, papers]) => {
      const evidencePaper = [...papers].sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
      return {
        name,
        area: question.subdomain,
        reason: `Ranked from ${papers.length} retrieved source record${papers.length === 1 ? "" : "s"} in this journal. The strongest observed record matched ${evidencePaper.relevanceReason.replace(/\.$/, "")}. Check the journal’s current scope and article requirements directly.`,
        source: evidencePaper.source,
        evidence: `${evidencePaper.title}${evidencePaper.year ? ` (${evidencePaper.year})` : ""} · ${evidencePaper.identifier ?? evidencePaper.doi ?? "source identifier not provided"}`,
        originalJournalLink: evidencePaper.journalUrl ?? "",
        relevanceScore: evidencePaper.relevanceScore,
      };
    })
    .sort((a, b) => (b.relevanceScore ?? -1) - (a.relevanceScore ?? -1))
    .slice(0, 5);
  return {
    journals,
    note: journals.length
      ? "Journal candidates are real venues observed in the ranked source set. Scores are screening scores derived from complete-representation matches in retrieved records, not acceptance probabilities; verify journal scope directly."
      : "Reliable journal evidence is insufficient in the retrieved set. MIDAS will not invent journal names or scores; identify venues after screening the original records and checking current scope pages.",
  };
}

function buildGuidance(question: ResearchQuestion, domain: Domain, literature: LiteratureItem[], sourceErrors: string[]) {
  const anchor = literature[0]?.title ?? "No matching source record was returned";
  const topic = question.topic;
  const population = question.population;
  const isAiDiagnostic = question.technology === "Artificial intelligence / machine learning" && question.researchTask === "Detection / diagnosis";
  const isMarineEcology = /microplastic|marine ecosystem/i.test(`${question.topic} ${question.dataType}`);
  const evidenceNote = literature.length
    ? `The ranked set contains ${literature.length} retrieved record${literature.length === 1 ? "" : "s"} for ${question.researchObjective}. Use it as a starting set; the strongest evidence and potential gaps still need full-text review.`
    : `No source records were returned for ${topic}; narrow the query or try again before making a literature-based decision.`;
  const commonMethodologies = isAiDiagnostic
    ? [
      {
        id: "model-development",
        name: "Model development",
        fit: `Develop and internally test a model that uses ${question.dataType.toLowerCase()} to detect ${topic.toLowerCase()}, with patient-level separation between training and held-out data.`,
        advantages: ["Makes the input representation and target label explicit", "Supports reproducible preprocessing and model comparison", "Can expose data leakage and class-imbalance risks early"],
        limitations: ["Internal performance can be optimistic", "Requires enough independent cases and controls", "Image quality, acquisition device, and labeling affect transportability"],
      },
      {
        id: "model-validation",
        name: "External or temporal validation",
        fit: `Validate the trained ${question.technology.toLowerCase()} on a separate population, site, device, or time period before making claims about ${topic.toLowerCase()}.`,
        advantages: ["Tests generalization beyond development data", "Reveals domain shift and subgroup performance differences", "Separates validation from model tuning"],
        limitations: ["Needs access to an independent dataset", "Reference-standard differences can distort results", "A single validation set may not represent deployment conditions"],
      },
      {
        id: "diagnostic-performance",
        name: "Diagnostic-performance evaluation",
        fit: `Evaluate ${question.outcome.toLowerCase()} against a prespecified clinical reference standard, rather than treating model development metrics as diagnostic evidence.`,
        advantages: ["Connects predictions to a clinically interpretable reference", "Supports sensitivity, specificity, calibration, and threshold reporting", "Makes intended use and error costs visible"],
        limitations: ["Requires a defensible reference standard", "Performance depends on prevalence and case mix", "A promising metric does not establish clinical utility"],
      },
    ]
    : isMarineEcology
      ? [
        {
          id: "exposure-characterization",
          name: "Exposure characterization",
          fit: `Measure ${question.exposure.toLowerCase()} in the relevant marine compartments and document site, season, sampling depth, and contamination controls.`,
          advantages: ["Makes exposure comparable across sites", "Supports traceable laboratory and field procedures", "Separates detection from ecological interpretation"],
          limitations: ["Microplastic measurement methods vary", "Sampling can miss spatial and temporal variation", "Laboratory contamination can bias estimates"],
        },
        {
          id: "field-ecology",
          name: "Comparative field ecology",
          fit: `Compare ${question.outcome.toLowerCase()} across marine sites or gradients while accounting for habitat, season, and other environmental conditions.`,
          advantages: ["Connects exposure measurements to real ecosystems", "Can reveal context and co-exposures", "Supports a feasible first ecological study"],
          limitations: ["Observational comparisons do not prove causation", "Site differences can confound results", "Ecological outcomes may require repeated monitoring"],
        },
        {
          id: "mesocosm-or-lab",
          name: "Mesocosm or controlled exposure study",
          fit: `Use a controlled marine-organism or mesocosm design only if the evidence review supports a specific ${question.exposure.toLowerCase()} level and measurable endpoint.`,
          advantages: ["Provides control over exposure conditions", "Can test mechanisms and timing", "Complements field evidence"],
          limitations: ["May not represent whole ecosystems", "Requires careful organism and welfare oversight", "Needs a justified exposure range"],
        },
      ]
      : [
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
    { name: question.dataType, type: "Data structure to be defined", role: "Observed input or measurement source" },
    { name: question.outcome, type: "To be defined", role: "Primary outcome" },
    { name: population, type: "Categorical / eligibility rule", role: "Target population" },
    { name: "Potential confounders from retrieved evidence", type: "To be defined", role: "Adjustment candidates" },
  ];
  const potentialGaps = derivePotentialGaps(question, literature);
  const journalRecommendations = buildJournalRecommendations(question, literature);
  const dataCollectionMethods = isAiDiagnostic && question.dataType === "Mammography images"
    ? ["Define the image acquisition protocol and permissible modalities", "Create patient-level labels using a prespecified clinical reference standard", "Split data by patient and document site, device, image quality, and missingness", "Pilot annotation and adjudication before model development"]
    : isAiDiagnostic && question.dataType === "Speech or voice recordings"
      ? ["Define recording device, language, prompt, environment, and duration", "Create patient-level diagnostic labels using a prespecified reference standard", "Separate speakers across development and validation sets", "Pilot audio quality, consent, transcription, and missingness checks"]
      : isMarineEcology
        ? ["Define sampling compartments, sites, depth, season, and mesh or detection thresholds", "Use field blanks and laboratory contamination controls", "Pair microplastic measurements with prespecified ecosystem indicators", "Record permits, weather, habitat, and co-exposures"]
        : ["Use the measurement procedure supported by the retrieved evidence", "Pilot the collection workflow", "Record protocol deviations and missingness", "Securely document source and collection dates"];
  const analysisStatistical = isAiDiagnostic
    ? ["Separate model development, internal validation, and external diagnostic-performance evaluation", "Report sensitivity, specificity, ROC-AUC, calibration, confidence intervals, and threshold choices only when the reference standard and sample structure support them", "Compare performance across relevant subgroups, sites, devices, or acquisition conditions", "Do not select a final threshold or claim clinical utility before the evaluation plan is prespecified"]
    : isMarineEcology
      ? ["Describe microplastic concentration, polymer or particle characteristics, site, season, and ecosystem indicators", "Choose association or comparison methods after the sampling unit and repeated-measure structure are defined", "Account for habitat, season, site, and measured co-exposures where supported by the design", "Avoid causal language unless the design and assumptions justify it"]
      : ["Choose descriptive summaries for each measurement scale", "Select association, comparison, prediction, or synthesis methods after the design is fixed", "Run sensitivity analyses for important definitions and assumptions", "Match inference to the sampling unit, missingness, measurement validity, and prespecified outcome"];
  const ethicsConsiderations = isAiDiagnostic && question.dataType === "Mammography images"
    ? ["Obtain the permissions and governance approvals required for patient imaging data.", "Protect images and linked clinical labels from re-identification; define access, retention, and sharing.", "Assess label quality, class balance, device/site shift, and subgroup performance before interpreting diagnostic claims.", "Clarify whether the intended use is research-only or could influence clinical decisions.", "Plan communication of limitations, false negatives, false positives, and incidental findings."]
    : isAiDiagnostic && question.dataType === "Speech or voice recordings"
      ? ["Obtain explicit consent for recording, storage, reuse, and possible voice identifiability.", "Minimize linked health and demographic data and control access to raw audio.", "Assess language, accent, age, sex, disability, and device-related performance differences.", "Define how diagnostic errors could affect participants and avoid implying clinical readiness without validation.", "Document deletion, de-identification, transcription, and data-sharing procedures."]
      : isMarineEcology
        ? ["Obtain site access, collection, wildlife, vessel, and environmental permits where required.", "Prevent sample contamination and document chain of custody for microplastic analysis.", "Minimize disturbance to organisms and habitats and define safe handling of contaminants.", "Predefine site selection and reporting so pollution burden is not selectively represented.", "State data, location, and ecological-risk limitations when sharing results."]
        : [`Consent and participant information must match the risks of researching ${topic}.`, "Collect the minimum identifiable or sensitive data needed for the question.", `Check whether ${population.toLowerCase()} requires additional safeguards or accessible study materials.`, "Define secure storage, access, retention, deletion, and data-sharing boundaries.", "Obtain the institutional, legal, or governance review required in the study setting."];
  const roadmap: RoadmapItem[] = [
    { stepId: "research-question", title: "Research question", focus: `Preserve the question “${question.originalIdea}” and test whether the objective—${question.researchObjective}—is specific enough.`, actions: [`Define ${topic} and the intended ${question.outcome.toLowerCase()} in operational terms`, `Resolve these before collection: ${question.clarifications.length ? question.clarifications.join(", ") : "protocol, comparison, and timing"}`], evidenceAnchor: anchor },
    { stepId: "planning", title: "Planning", focus: `Set boundaries for ${topic} in ${population.toLowerCase()} using ${question.dataType.toLowerCase()}.`, actions: [`Write eligibility and exclusion criteria for ${population.toLowerCase()}`, `Choose the smallest useful sample and define ${question.outcome.toLowerCase()} before data collection`], evidenceAnchor: anchor },
    { stepId: "literature-review", title: "Literature search", focus: `Search ${domain} and ${question.subdomain} sources using the complete representation: ${question.keyConcepts.slice(0, 5).join(", ")}.`, actions: [`Screen the ${literature.length} retrieved records into the four relevance tiers`, "Record inclusion decisions, provider names, search dates, and full-text availability"], evidenceAnchor: anchor },
    { stepId: "methodology", title: "Relevant evidence and gaps", focus: `${evidenceNote} Compare evidence for ${question.researchTask.toLowerCase()} using ${question.dataType.toLowerCase()}.`, actions: ["Compare designs, reference standards, measures, and populations in the original sources", "Write a potential gap with its evidence count and verification caveat"], evidenceAnchor: anchor },
    { stepId: "instruments", title: "Methodology / study design", focus: `Choose a design that can answer the ${question.researchTask.toLowerCase()} question about ${topic} with ${question.dataType.toLowerCase()}.`, actions: [`Define the comparison, reference standard, or sampling gradient for ${question.outcome.toLowerCase()}`, `Pre-specify the primary outcome, timing, and quality checks for ${question.dataType.toLowerCase()}`], evidenceAnchor: anchor },
    { stepId: "ethics", title: "Instruments / data requirements", focus: `Select valid, feasible measures for ${population.toLowerCase()} and the ${question.dataType.toLowerCase()} workflow.`, actions: [`Verify the primary ${question.outcome.toLowerCase()} measure against original validation evidence`, `Document acquisition, annotation, assay, recording, or sampling requirements for ${question.dataType.toLowerCase()}`], evidenceAnchor: anchor },
    { stepId: "data-collection", title: "Ethics and data collection", focus: `Plan responsible collection of ${question.dataType.toLowerCase()} for ${topic}.`, actions: [`Identify consent, privacy, permits, contamination, or data-governance needs relevant to ${question.dataType.toLowerCase()}`, "Define recruitment or site selection, storage, quality checks, and missing-data handling"], evidenceAnchor: anchor },
    { stepId: "data-analysis", title: "Analysis", focus: `Match the ${question.researchTask.toLowerCase()} analysis to ${question.dataType.toLowerCase()}, ${question.outcome.toLowerCase()}, and the evidence gap for ${topic}.`, actions: ["Create a variable map with the sampling or participant unit", "Write a prespecified descriptive and inferential analysis plan with assumptions and sensitivity checks"], evidenceAnchor: anchor },
    { stepId: "manuscript-writing", title: "Writing", focus: `Write the contribution around “${question.originalIdea}”, the retrieved evidence, and what remains uncertain about ${topic}.`, actions: ["Separate retrieved findings, potential gaps, and MIDAS planning guidance", `Report how ${question.dataType.toLowerCase()} were collected or evaluated and state generalizability limits`], evidenceAnchor: anchor },
    { stepId: "journal-selection", title: "Journal selection", focus: `Shortlist evidence-backed venues for ${question.subdomain} work on ${topic}; do not treat a match score as acceptance probability.`, actions: ["Check aims, scope, article type, indexing, and current author guidance", "Compare each venue with the original source evidence shown in the journal cards"], evidenceAnchor: anchor },
    { stepId: "publication", title: "Publication", focus: `Prepare a transparent submission answering “${question.originalIdea}” with traceable ${question.dataType.toLowerCase()} methods and limitations.`, actions: ["Confirm references, data/code statements, ethics statements, reporting guidelines, and disclosures", "Use the selected journal’s current submission instructions and retain the submission record"], evidenceAnchor: anchor },
  ];

  return {
    evidence: {
      sourceCount: literature.length,
      summary: evidenceNote,
      gaps: [
        ...potentialGaps,
        ...(sourceErrors.length ? [`Provider limitation observed during this search: ${sourceErrors.join("; ")}.`] : []),
      ],
      caveat: "These are potential gaps inferred from retrieved metadata and abstracts, not confirmed gaps. Verify every point against the original papers; this is not a complete systematic review.",
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
      considerations: ethicsConsiderations,
      disclaimer: "MIDAS guidance is educational planning support, not ethics approval, legal advice, clinical advice, or regulatory approval.",
    },
    dataCollection: {
      participants: population,
      variables: [question.exposure, question.outcome, "Eligibility and participant characteristics to be defined", "Data quality and missingness indicators"],
      methods: dataCollectionMethods,
      inclusion: ["Matches the written population and study setting", "Meets consent or permission requirements", "Has the minimum data needed for the primary analysis"],
      exclusion: ["Fails prespecified eligibility criteria", "Has unusable or missing primary measures", "Would create a safety, privacy, or data-quality concern"],
    },
    analysis: {
      variables,
      descriptive: ["Participant or record flow", "Distribution of exposures, interventions, and outcomes", "Missing-data and quality summary", "Comparison of included and excluded records where appropriate"],
      statistical: analysisStatistical,
      note: `No final statistical method is prescribed. A qualified researcher should review the ${question.researchTask.toLowerCase()} plan for ${question.dataType.toLowerCase()} against the design, measurement validity, sampling, missingness, and assumptions before interpretation.`,
    },
    journals: journalRecommendations.journals,
    journalSelectionNote: journalRecommendations.note,
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
  const rankedRecords = retrieved.records
    .map((record) => ({ record, ranking: scoreRecord(record, question) }))
    .sort((a, b) => b.ranking.score - a.ranking.score);
  const literature = rankedRecords.map(({ record, ranking }) => toLiteratureItem(record, question, ranking));
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
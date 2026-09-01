import { Router, type IRouter } from "express";
import { processResearchIdea } from "../lib/research";

const router: IRouter = Router();

router.post("/research", async (req, res) => {
  const idea = typeof req.body?.idea === "string" ? req.body.idea : "";

  try {
    const result = await processResearchIdea(idea);
    if ("needsNarrowing" in result) {
      res.status(422).json(result);
      return;
    }
    res.json(result);
  } catch (error) {
    req.log.error({ err: error }, "Research search failed");
    res.status(502).json({
      message: "The scholarly search could not be completed right now. No mock results were substituted.",
      detail: "Try again in a moment or narrow the research idea.",
    });
  }
});

export default router;
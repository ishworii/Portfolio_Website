// Catch-all: unknown /api/* paths get the API's own JSON 404 with the
// endpoint list, instead of Vercel's platform 404 page. Named function
// files take precedence over this one.
import { nodeHandler } from "../content/api.js";

export default nodeHandler();

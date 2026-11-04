const http = require("http");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

// Dynamically extract all lesson IDs from CURRICULUM_STAGES in curriculumData.ts
const curriculumContent = fs.readFileSync("./src/lib/curriculum/curriculumData.ts", "utf8");
const stageSection = curriculumContent.split("export const LESSON_DETAILS")[0];
const ALL_LESSON_IDS = [...stageSection.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);

async function runSmokeTests() {
  console.log("===============================================================");
  console.log(" SYSTEMVERSE — AUTOMATED LESSON ROUTE SMOKE & REGRESSION SUITE");
  console.log("===============================================================\n");

  const baseUrl = "http://127.0.0.1:3001";
  let passedCount = 0;
  let failedCount = 0;

  console.log(`[TEST SUITE 1] Valid Dynamic Curriculum Routes (${ALL_LESSON_IDS.length} routes from CURRICULUM_STAGES)`);
  for (const lessonId of ALL_LESSON_IDS) {
    const url = `${baseUrl}/learn/${lessonId}`;
    try {
      const res = await fetchUrl(url);
      const hasControls = res.body.includes("LAB SANDBOX") && res.body.includes("ROADMAP");
      if (res.statusCode === 200 && hasControls) {
        passedCount++;
        console.log(`  ✓ [200 OK] /learn/${lessonId}`);
      } else {
        failedCount++;
        console.error(`  ✗ [FAIL] /learn/${lessonId} — Status: ${res.statusCode}, hasControls: ${hasControls}`);
      }
    } catch (e) {
      failedCount++;
      console.error(`  ✗ [ERR] /learn/${lessonId} — ${e.message}`);
    }
  }

  console.log("\n[TEST SUITE 2] Genuinely Invalid Lesson Routes (Must return 404)");
  const invalidRoutes = [
    "invalid-non-existent-lesson",
    "monolith-vs-microservices-xyz-random",
    "hack-route-attempt-404"
  ];

  for (const invId of invalidRoutes) {
    const url = `${baseUrl}/learn/${invId}`;
    try {
      const res = await fetchUrl(url);
      if (res.statusCode === 404 && res.body.includes("Lesson Route Undefined")) {
        passedCount++;
        console.log(`  ✓ [404 NOT FOUND] /learn/${invId} (Branded 404 UI confirmed)`);
      } else {
        failedCount++;
        console.error(`  ✗ [FAIL] /learn/${invId} — Expected 404, got ${res.statusCode}`);
      }
    } catch (e) {
      failedCount++;
      console.error(`  ✗ [ERR] /learn/${invId} — ${e.message}`);
    }
  }

  console.log("\n[TEST SUITE 3] Legacy /lessons/ Route Redirects (Must return 307)");
  const legacyRoutes = [
    "monolith-vs-microservices",
    "what-happens-when-website-loads"
  ];

  for (const legId of legacyRoutes) {
    const url = `${baseUrl}/lessons/${legId}`;
    try {
      const res = await fetchUrl(url);
      const location = res.headers["location"];
      if (res.statusCode === 307 && location === `/learn/${legId}`) {
        passedCount++;
        console.log(`  ✓ [307 REDIRECT] /lessons/${legId} -> ${location}`);
      } else {
        failedCount++;
        console.error(`  ✗ [FAIL] /lessons/${legId} — Expected 307 to /learn/${legId}, got ${res.statusCode}`);
      }
    } catch (e) {
      failedCount++;
      console.error(`  ✗ [ERR] /lessons/${legId} — ${e.message}`);
    }
  }

  console.log("\n===============================================================");
  console.log(` SMOKE TEST SUMMARY: Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log("===============================================================");

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSmokeTests();

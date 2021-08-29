const fs = require("fs");

const Mocha = require("mocha");

const { EVENT_RUN_END, EVENT_SUITE_BEGIN } = Mocha.Runner.constants;

class KnapsackReporter {
  constructor(runner, options) {
    const stats = runner.stats;
    const { reporterOptions } = options;
    const { output } = reporterOptions ? reporterOptions : {};

    if (!output) {
      throw new Error(
        "mocha-knapsack-reporter: 'output' must be configured for KnapsackReporter to work"
      );
    }

    let spec;

    runner
      .on(EVENT_SUITE_BEGIN, (suite) => {
        if (suite.root) {
          spec = suite.file;
        }
      })
      .once(EVENT_RUN_END, () => {
        if (!spec) {
          throw new Error(
            "mocha-knapsack-reporter: 'spec' hasn't been determined"
          );
        }

        const { duration } = stats;

        const content = fs.existsSync(output)
          ? JSON.parse(fs.readFileSync(output).toString())
          : {};

        fs.writeFileSync(
          output,
          JSON.stringify(
            {
              ...content,
              [spec]: duration,
            },
            null,
            2
          )
        );
      });
  }
}

module.exports = KnapsackReporter;

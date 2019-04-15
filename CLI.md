I'd like to keep a standard pattern for all polykey commands. Something like:

* STDIN is used for user-prompts
* STDOUT is the default output, unless redirected with a specific option like `--output`.
* STDERR is used for reporting status or asking questions to user for user prompts

Any file or location to be used by a polykey command should be referred to by an argument. Multiple files or locations can be specified as arguments to subcommands.

Options are things like `--algorithm=...` should always have a short version like `-al`. Short options can be 2 letters or more or single option.

Options should use kebab-case like `--one-thing`.

Options should be used prior or after arguments for a given command/subcommand. `pk c --option=... arg --option=...`. So the options should be thought of as like keyword arguments in Python, the positioning doesn't matter as long as it is after a particular command/subcommand.

Flags are like options, but without a value. So that's really the same as an option that has a true or false value. Flags when they exist should also mean that the value is true. If flags don't exist then it should mean the value is false. So things like `-v`.

Every command/subcommand should have `--help | -h`. Also the `--verbose --verbose` can be chained up to have different logging levels.

When you need to output multiple files, you can no longer use STDOUT, unless there's a primary output and optional output. However, if what we are talking about is multiple optional outputs then all outputs should be specified as options. If what we are talking about multiple mandatory outputs, then they should be arguments.

There can be exceptions to the above guidelines, but it should be documented.

---
title: "No, Natural Language is not a Replacement for High level Languages."
date: "2026-09-23"
description: "Compilers earned trust because they were deterministic. Natural language is ambiguous and LLMs sample their output, so prompting is a leap in productivity, not the next step after high-level languages."
tags: ["ai", "software-engineering", "nlp", "programming-languages"]
author: "Shevinu Nawalage"
---

It always bugs me when people argue that shifting to LLMs from high-level languages is similar to what happened when we transitioned from low-level languages to high-level. This argument is flawed.

A key similarity between low-level languages and high-level languages was that they both were deterministic. Natural language is ambiguous while LLMs that consume it are probabilistic.

Early programmers did not trust compilers either but checked the generated assembly by hand. However, compilers gained trust because they were deterministic and followed fixed rules. LLMs can't be trusted the same way. There are no rules defining what a prompt means. Their output needs to be read, checked, and owned by engineers.

## What does deterministic mean?

The easiest explanation is "strictly predictable". The language can be interpreted in a single way and one input cannot map to two outputs. In computer science terms, a deterministic automaton has one transition per input so it always behaves the same on the same input.

Compilers read code in two deterministic stages.

1. Lexical analysis uses a DFA to split code into tokens.
2. Syntax analysis applies an unambiguous context-free grammar so every valid program has exactly 1 parse tree.

Finally, the language specification defines the outcome. Read [ECMA-262](https://ecma-international.org/wp-content/uploads/ECMA-262_17th_edition_june_2026.pdf) [1] for JS runtime semantics.

If you want to read more about Deterministic Finite Automaton, this is a good resource: [Deterministic Finite Automaton](https://www.sciencedirect.com/topics/computer-science/deterministic-finite-automaton) [2].

## What's up with LLMs?

Natural languages have none of this and their meaning depends on context. For example, "You were _right_" vs. "Make a _right_ turn at the light." LLMs add a second problem since they sample the next token from a probability distribution so the same prompt can produce different code. This translation is stochastic and not deterministic.

Without a background in theoretical computer science, it's easy to miss why natural language cannot replace high-level languages. Here are my thoughts:

1. Will we see natural language used to create products? Yes
2. Will natural language replace high-level languages? No

There's a difference here. A lot of products being created during this era do not carry a risk of a catastrophe if one invariant is incorrect. We see people constantly posting that they created a website without any development experience in 2 hours. This is not a game changer but a result of simple websites being heavily represented in LLM training data. LLMs learn from patterns in large amounts of data. They are extremely capable but also uneven.

In contrast, let's say we are building the software for critical operations whether it's banking systems or payment processing gateways. High compliance enterprises require accountability for every change so they don't let LLMs define the product without deterministic verification. Most of these industries established their core verification tests before LLMs became popular. They cannot allow an ambiguous language and a probabilistic model to define the product.

## But aren't LLMs getting better?

Apple researchers tested whether LLMs reason or match patterns in [GSM-Symbolic](https://arxiv.org/pdf/2410.05229) [3]. In 2024 models, adding one irrelevant sentence to simple math problems dropped accuracy by up to 65%. The authors concluded that the models were matching problems to patterns they had seen before.

While newer models are much stronger, at times rivalling classical planners, we still see the same weakness. The models generate plans based on learned patterns and can produce sequences that have invalid steps or miss constraints [5]. The 2026 Stanford AI Index Report found that when task descriptions were scrambled, performance dropped for most models [5]. A classical planner, a rule-based program that checks every step against exact rules, scored identically on both versions [5]. It works on the problem's structure, not its wording, just like the compilers I discussed above.

In addition, the researchers who worked on the original study behind Stanford's planning data ran every LLM-generated plan through VAL, a rule-based validator, because LLMs aren't guaranteed to produce only valid plans or to find a plan if one exists [6]. The model proposes the plan while something deterministic still has to check it.

> "LLM-based planning is neither guaranteed to produce only valid plans (soundness) nor to find a plan whenever one exists (completeness). We address the soundness concern by validating all LLM-generated plans with VAL, discarding any plans that fail verification" [6].

As of early 2026, while LLMs matched top human contestants on math problems with checkable answers, they fell behind when producing "rigorous, step-by-step mathematical proofs" [5]. That gap may be closing after OpenAI announced an AI-generated proof of the Navier–Stokes Millennium Prize Problem, not yet independently verified [12]. But the underlying argument remains the same: OpenAI released the proof alongside a version checked by Lean, a rule-based proof checker [12]. Researchers also directed the effort and chose which versions of the problem to attack and where to focus. And experts still have to confirm that the formal statement matches the real problem. Even at the frontier level, AI output is trustworthy only through deterministic verification.

## What about when we reach AGI?

There is no agreed-upon definition of AGI. Google DeepMind researchers reviewed nine popular definitions and concluded that the field needs a shared, measurable definition [10]. My view is that AI companies tend to use looser definitions than independent researchers. The same DeepMind paper labels today's chatbots "Emerging AGI" [10].

The Forecasting Research Institute published results from a panel of 339 AI experts in November 2025. Here's an important quote:

> "The median expert expects much slower progress than prominent leaders of frontier AI labs. These lab leaders predict human-level or superhuman AI by 2026–2029, while most of our expert panel rejects these shorter timelines."
>
> *(The Longitudinal Expert AI Panel [11])*

Here are a few sources supporting my view on LLMs being an unreliable path towards AGI:

1. [The Association for the Advancement of Artificial Intelligence](https://aaai.org) 2025 Presidential Panel on the Future of AI Research report surveyed 475 AI researchers and 76% said that scaling up current AI approaches is "unlikely" or "very unlikely" to reach AGI [7].
2. Meta's former chief AI scientist Dr. Yann LeCun (who is also a Turing Award winner) called the AGI narrative a distraction [4] and explained why LLMs will not lead to AGI [8].
3. Dr. Ilya Sutskever, who is a co-founder of OpenAI and the most prominent figure in the era of scaling (in my opinion) argued the age of scaling is ending and models generalize far worse than people [9]. (The cited podcast episode is much more comprehensive and I would recommend everyone listen to it.)
   > There are 2 students, 1 who practices for 10,000 hours and another who practices for 100 hours. They both did well. A model is like the student who practiced for 10,000 hours on every competitive programming problem ever written. It excels on the test, but that intense, narrow practice doesn't carry over the way a human's learning does [9]. Sutskever argues "Which one do you think is going to do better in their career later on?"
   >
   > *(Paraphrase of Ilya Sutskever's Words [9])*

When I say AGI, I refer to human-level intelligence. It's close to what some prominent AI researchers call it. Regardless, the label matters less than the outcome. For an AI to replace an engineer who reviews the code, it needs to be able to have human-level judgment and intuition. Until then deterministic verification remains essential.

## What's happening now?

Every day, we use an ambiguous language and a probabilistic model to define the deterministic code that gets shipped across workplaces. Many developers are unaware of the deterministic checks that are enforced by the code they produced.

For example, if an LLM stores prices as floating-point numbers, rounding errors can cause a lot of issues. To a computer, 0.1 + 0.2 isn't 0.3 exactly (it's 0.30000000000000004). Tests with simple amounts will pass, but across thousands of transactions the totals stop matching the records. It takes an experienced engineer to know to look for it.

I said LLMs were a junior developer initially. But I realize this was a misleading term to use. A junior developer is weaker than a senior at almost everything. LLMs excel in areas where humans are weak, such as memory, and fall short in areas where humans are strong, such as judgment [5]. So, in my view, LLMs are not a replacement for writing in high-level languages but rather an assistant that works alongside you. You can use them to research and learn and then write code, tests, and documentation from a spec. However, engineers need to know what they are writing in order to evaluate the output. We need engineers to plan the spec. Engineers define and enforce the deterministic checks.

If engineers become 'meat proxies' who pass prompts, that review disappears and we will face a dangerous realization long term when the deterministic checks that need to be enforced are broken and engineers are unaware of how to fix them. And worst of all who is responsible for the mess this might cause?

That's why I don't see this as the next revolution in programming languages, but rather a leap in productivity. Software will still be written in high-level languages, but instead of writing every line, you'll plan, read, and verify it. And because humans still have to verify it, that code will stay in languages humans can read.

## References

1. Ecma International. (2026). *ECMA-262: ECMAScript® 2026 language specification* (17th ed.). https://ecma-international.org/wp-content/uploads/ECMA-262_17th_edition_june_2026.pdf
2. Elsevier. (n.d.). *Deterministic finite automaton*. ScienceDirect Topics. https://www.sciencedirect.com/topics/computer-science/deterministic-finite-automaton
3. Mirzadeh, I., Alizadeh, K., Shahrokhi, H., Tuzel, O., Bengio, S., & Farajtabar, M. (2024). *GSM-Symbolic: Understanding the limitations of mathematical reasoning in large language models* (arXiv:2410.05229). arXiv. https://arxiv.org/abs/2410.05229
4. Sullivan, M. (2025, December 18). Is 'artificial general intelligence' an illusion? Yann LeCun thinks so. *Fast Company*. https://www.fastcompany.com/91462273/yann-lecun-artificial-general-intelligence-databricks-google-gemini-3-flash
5. Stanford Institute for Human-Centered Artificial Intelligence. (2026). Technical performance. In *AI Index Report 2026* (Chapter 2, pp. 68–125). Stanford University. https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_2_technical.pdf
6. Corrêa, A. B., Pereira, A. G., & Seipp, J. (2025). *Frontier large language models rival state-of-the-art planners* (arXiv:2511.09378). arXiv. https://arxiv.org/abs/2511.09378
7. Association for the Advancement of Artificial Intelligence. (2025). *AAAI 2025 presidential panel on the future of AI research*. https://aaai.org/wp-content/uploads/2025/03/AAAI-2025-PresPanel-Report-FINAL.pdf
8. Imagination in Action. *Why LLMs will not lead to AGI | Yann LeCun* [Video]. YouTube. https://www.youtube.com/watch?v=5PQtJxd4U0M
9. Dwarkesh Patel. (2025, November 25). *Ilya Sutskever – We're moving from the age of scaling to the age of research* [Video]. YouTube. https://www.youtube.com/watch?v=aR20FWCCjAs
10. Morris, M. R., Sohl-Dickstein, J., Fiedel, N., Warkentin, T., Dafoe, A., Faust, A., Farabet, C., & Legg, S. (2024). Position: Levels of AGI for operationalizing progress on the path to AGI. In *Proceedings of the 41st International Conference on Machine Learning* (PMLR 235). https://arxiv.org/abs/2311.02462
11. Murphy, C., Rosenberg, J., Canedy, J., Jacobs, Z., Flechner, N., Britt, R., Pan, A., Rogers-Smith, C., Mayland, D., Buffington, C., Kučinskas, S., Coston, A., Kerner, H., Pierson, E., Rabbany, R., Salganik, M., Seamans, R., Su, Y., Tramèr, F., . . . Karger, E. (2025). *The Longitudinal Expert AI Panel: Understanding expert views on AI capabilities, adoption, and impact* (Working Paper No. 5). Forecasting Research Institute. https://forecastingresearch.org/research/longitudinal-expert-ai-panel-leap-working-paper
12. OpenAI. (2026, September 8). *On the Navier–Stokes Millennium Prize Problem*. https://openai.com/index/navier-stokes-solution/

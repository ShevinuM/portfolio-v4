---
title: "No, Natural Language is not a Replacement for High level Languages."
date: "2026-09-23"
description: "Compilers earned trust because they were deterministic. Natural language is ambiguous and LLMs sample their output, so prompting is a leap in productivity, not the next step after high-level languages."
tags: ["ai", "software-engineering", "nlp", "programming-languages"]
author: "Shevinu Nawalage"
---

It always bugs me when people argue that shifting to LLMs from high-level languages is similar to what happened when we transitioned from low-level languages to high-level. This argument is flawed.

A key similarity between low-level languages and high-level languages was that they both were deterministic. Natural language is ambiguous while LLMs who consume them are probabilistic.

Early programmers did not trust compilers either but checked the generated assembly by hand. However, compilers gained trust because they were deterministic and followed fixed rules. LLMs can't be trusted the same way. There are no rules defining what a prompt means. Their output needs to be read, checked, and owned by engineers.

## What does Deterministic mean?

The easiest explanation is "strictly predictable". The language can be interpreted in a single way and one input cannot map to two outputs. In computer science terms, a deterministic automaton has one step per each input so it always behaves the same on the same input.

Compilers read code in two deterministic stages.

1. Lexical analysis uses a DFA to split code into tokens.
2. Syntax analysis applies an unambiguous context-free grammar so every valid program has exactly 1 parse tree.

Finally, the language specification defines the outcome. Read [ECMA-262](https://ecma-international.org/wp-content/uploads/ECMA-262_17th_edition_june_2026.pdf) [1] for JS runtime semantics.

If you want to read more about Deterministic Finite Automaton, this is a good resource: [Deterministic Finite Automaton](https://www.sciencedirect.com/topics/computer-science/deterministic-finite-automaton) [2].

## What's up with LLMs?

Natural languages have none of this and their meaning depends on context. For example, "You were _right_" vs. "Make a _right_ turn at the light." LLMs add a second problem since they sample the next token from a probability distribution so the same prompt can produce different code. This translation is stochastic and not deterministic.

Without a background in theoretical computer science, it's easy to miss why natural language cannot replace high-level languages. As someone with a background in [NLP and linguistics](https://www.researchgate.net/publication/406006394_Named_Entity_Recognition_in_Subsea_Inspections) [3], here are my thoughts:

1. Will we see natural language used to create products? Yes
2. Will natural language replace high-level languages? No

There's a difference here. A lot of products being created during this era do not carry a risk of a catastrophe if one invariant is incorrect. We see people constantly posting that they created a website without any development experience in 2 hours. This is not a game changer but a result of simple websites being heavily represented in LLM training data. LLMs in the end are complex pattern matching systems trained on large sets of data to produce results based on what they have encountered before.

In contrast, let's say we are building the software for critical operations whether it's banking systems or payment processing gateways. High compliance enterprises require accountability for every change so they don't let LLMs define the product without deterministic verification. Most of these industries established their core verification tests before LLMs became popular. They cannot allow an ambiguous language and a probabilistic model to define the product.

## Can AGI handle the verification instead?

AGI won't arrive in time to verify our systems and LLMs may even be delaying it.

In [On the Dangers of Stochastic Parrots](https://dl.acm.org/doi/10.1145/3442188.3445922) [4], Bender et al. argue that language models stitch together text based on patterns in their training data. AGI on the other hand requires the integration of various cognitive abilities and is characterized by the ability to reason thoroughly and intuitively.

Apple researchers tested this in [GSM-Symbolic](https://arxiv.org/pdf/2410.05229) [5]. Adding one irrelevant sentence to simple math problems dropped accuracy by up to 65%. The models weren't reasoning but matching problems to patterns they had seen before.

François Chollet in [Dwarkesh Podcast](https://www.dwarkesh.com/p/francois-chollet) [6] mentioned that OpenAI set back the progress towards AGI by 5-10 years because frontier research is no longer being published and LLMs are an off-ramp on the path to AGI. Yann LeCun called AGI narrative a [distraction](https://www.fastcompany.com/91462273/yann-lecun-artificial-general-intelligence-databricks-google-gemini-3-flash) [7], and [out of 475 AI researchers, 76% said scaling up current AI approaches is unlikely or very unlikely to produce AGI](https://futurism.com/ai-researchers-tech-industry-dead-end) [8].

What I said just scratched the surface here. This is a vast topic that belongs in a future blog post which I will write next.

## What's happening now?

We see that every day we are using an ambiguous language and a probabilistic model to define the deterministic code that gets shipped across workplaces. Many developers are unaware of the deterministic checks that are enforced by the code they produced. For example, if an LLM writes a payment handler and drops the idempotency check, a retried request charges the customer twice. No test will cover it so nobody notices it till it goes to production.

LLMs in my opinion are not a replacement for deterministic languages but rather a junior developer who turns a spec into code. Junior code is safe only because a senior dev reviews it. If engineers become 'meat proxies' who pass prompts, that review disappears and we will face a dangerous realization long term when the deterministic checks that need to be enforced are broken and engineers are unaware of how to fix them. Until true AGI arrives (which isn't anytime soon), LLMs will continue to remain a junior dev.

So we should not treat this as the next revolution in programming languages but rather a leap in productivity.

## References

1. Ecma International. (2026). *ECMA-262: ECMAScript® 2026 language specification* (17th ed.). https://ecma-international.org/wp-content/uploads/ECMA-262_17th_edition_june_2026.pdf
2. Elsevier. (n.d.). *Deterministic finite automaton*. ScienceDirect Topics. https://www.sciencedirect.com/topics/computer-science/deterministic-finite-automaton
3. Nawalage, S. M. C. (2025). *Named entity recognition in subsea inspections*. ResearchGate. https://www.researchgate.net/publication/406006394_Named_Entity_Recognition_in_Subsea_Inspections
4. Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? In *Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency* (pp. 610–623). https://doi.org/10.1145/3442188.3445922
5. Mirzadeh, I., Alizadeh, K., Shahrokhi, H., Tuzel, O., Bengio, S., & Farajtabar, M. (2024). *GSM-Symbolic: Understanding the limitations of mathematical reasoning in large language models* (arXiv:2410.05229). arXiv. https://arxiv.org/abs/2410.05229
6. Patel, D. (Host). (2024, June 11). Francois Chollet — Why the biggest AI models can't solve simple puzzles [Audio podcast episode]. In *Dwarkesh Podcast*. https://www.dwarkesh.com/p/francois-chollet
7. Sullivan, M. (2025, December 18). Is 'artificial general intelligence' an illusion? Yann LeCun thinks so. *Fast Company*. https://www.fastcompany.com/91462273/yann-lecun-artificial-general-intelligence-databricks-google-gemini-3-flash
8. Landymore, F. (2025, March 18). Majority of AI researchers say tech industry is pouring billions into a dead end. *Futurism*. https://futurism.com/ai-researchers-tech-industry-dead-end

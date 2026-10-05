---
title: "MobyGrep"
description: "What if you could search a whale call? MobyGrep listens to live underwater microphones (hydrophones) and runs the audio through Perch 2.0, a pretrained bioacoustics model, to turn each sound into a numeric fingerprint. A classifier trained on expert-labeled Orcasound recordings decides whether it's a whale call, and every call becomes searchable by similarity in Postgres with pgvector. Accuracy is measured against OrcaHello, the existing open-source orca detector."
external_url: "https://github.com/ShevinuM/moby-grep"
tags:
  - "python"
  - "fastapi"
  - "redis"
  - "postgres"
  - "pgvector"
  - "docker"
---

What if you could search a whale call? MobyGrep listens to live underwater microphones (hydrophones) and runs the audio through Perch 2.0, a pretrained bioacoustics model, to turn each sound into a numeric fingerprint. A classifier trained on expert-labeled Orcasound recordings decides whether it's a whale call, and every call becomes searchable by similarity in Postgres with pgvector. Accuracy is measured against OrcaHello, the existing open-source orca detector.

The source is at [github.com/ShevinuM/moby-grep](https://github.com/ShevinuM/moby-grep).

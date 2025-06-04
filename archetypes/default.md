---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: {{ .Date }}
draft: false
slug: {{ substr .File.UniqueID 0 7 }}
description:
summary:
tags:
  - draft
categories:
  - draft
cover:
---

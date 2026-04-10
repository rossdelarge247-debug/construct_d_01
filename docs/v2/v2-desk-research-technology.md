# V2 Desk Research — Technology, Competitors, and Regulatory Landscape

Research conducted April 2026 across fintech products, AI extraction benchmarks, regulatory bodies, and legaltech platforms. This document covers the technology landscape that informs V2's build decisions and competitive positioning.

---

## Sources researched

- Armalytix (product, FCA register, case studies, Trustpilot, Open Banking registration)
- Splitifi (UK product, patents, pricing, AI capabilities)
- LEAP Legal Software (family law module, Financial Statement app)
- Clio UK (family law features)
- Dext / Receipt Bank (extraction UX pattern, bank statement extraction)
- adieu.ai (AI paralegal for family law)
- Amicable (legaltech evolution)
- SeparateSpace (self-help divorce tool)
- Heron Data, Ocrolus, Klippa/DocHorizon, DocuClipper, Parsio (extraction tools)
- TrueLayer, Plaid (Open Banking infrastructure)
- Koncile (LLM extraction benchmarks — Claude vs GPT vs Gemini)
- Anthropic (structured outputs documentation)
- SRA (innovation guidance, AI and competence)
- FCA (AISP regulation, Open Banking, Open Finance roadmap)
- ICO (lawful basis, legitimate interests, GDPR guidance)
- Data (Use and Access) Act 2025 (Smart Data framework)
- Resolution (Code of Practice, Resolution Together, NCDR)

---

## 1. AI document extraction — state of the art

### Bank statement parsing

Modern tools achieve 95–99%+ accuracy on clean, digital PDFs from major banks. Heron Data claims 99%+; independent testing shows closer to 91% for fully automated processing. On scanned or degraded documents, accuracy drops to 85–90% without human review.

**Key challenge:** Format variability. Each UK bank uses a different PDF layout, and banks periodically change formats. Scanned statements, locked PDFs, and redacted documents add complexity.

**Commercial tools:** Heron Data (developer API, structured JSON + categorisation), Ocrolus (ML + human review, 99% claimed), DocuClipper (bank statement to CSV), Klippa/DocHorizon (99%+ claimed), Klearstack (AI OCR), Extracta Labs.

**Modern best practice:** Hybrid OCR + LLM pipeline. Traditional OCR handles text extraction; LLM interprets layout, identifies transaction tables, structures output. Achieves 95%+ even on challenging documents.

### LLM extraction benchmarks (2024–2026)

Koncile benchmarked 300 text-based PDFs and 200 scanned invoices:

| Model | Text PDFs | Scanned documents |
|-------|----------|-------------------|
| GPT-4 | 98% | 91% (with OCR) |
| Claude | 97% | 90% (with OCR) |
| Gemini | 96% | 94% (native vision) |

**JSON reliability:** Claude offered best JSON format consistency (valid in all cases). GPT showed occasional syntax errors at high volume. Gemini sometimes required post-processing.

**Anthropic structured outputs** (November 2025 public beta) compile JSON schemas into a grammar constraining token generation at inference — mathematical certainty of schema compliance. This directly addresses V2's truncated JSON problem.

**Hallucination reduction best practices:**
1. Use constrained generation / structured outputs with JSON schemas
2. Prompt with "only derive information from the provided context" and "cite specific passages"
3. Field-level validation rules post-extraction
4. RAG-based cross-referencing against source text
5. Per-field confidence scoring routing uncertain extractions for human review

**Cost:** Gemini Flash 2.0 can process 6,000 pages for $1. LLM extraction is cost-competitive with traditional OCR.

### Payslip extraction

UK payslips must legally show: gross pay, net pay, income tax (with tax code), NI contributions, pension contributions, student loan repayments, and YTD cumulative totals. No single mandated format — every employer/payroll provider (Sage, Xero, ADP) produces different layouts. But required fields are consistent by law, making LLM extraction feasible.

**Form E relevance:** Gross annual income, net income, tax paid, NI, pension contributions, benefits in kind. YTD section is particularly valuable for cross-referencing against P60 data.

### Mortgage statement extraction

Key fields: outstanding balance, interest rate (per mortgage part), monthly payment, term end date, early repayment charges (and ERC expiry date), transaction history. Many UK mortgages have multiple parts (fixed + variable) with separate balances, rates, and terms.

### Multi-document intelligence

Cross-referencing patterns relevant to V2:
- Matching gross income on payslips to salary deposits on bank statements
- Verifying mortgage payments on bank statements against mortgage statement amounts
- Cross-checking pension contributions on payslips against pension scheme statements
- Identifying discrepancies that may indicate undisclosed income or assets
- Flagging unexplained large transactions

### Document classification

Advanced platforms achieve 99%+ classification accuracy on financial documents. For V2's document set (bank statements, payslips, pension letters, mortgage statements, P60s), classification is a bounded problem. Vision-capable LLMs classify these with very high accuracy since document types are visually and semantically distinct.

### Confidence scoring

Production systems score confidence per field:
- **Mindee:** Four tiers — Certain, High, Medium, Low
- **Veryfi:** Two scores per field — OCR confidence + field mapping confidence
- **Standard thresholds:** 0.7–0.9 minimum depending on sensitivity

**Best practice for financial documents:** Auto-accept above 0.95, flag 0.80–0.95 for user confirmation with source highlighted, require manual entry below 0.80. Financial figures in divorce carry high stakes — thresholds should be conservative.

**Feedback loop:** Low-confidence extractions serve as training data. Every uncertain case improves future accuracy. High-efficiency systems ensure humans only interact with the most complex 5% of documents.

---

## 2. Open Banking for financial disclosure

### Armalytix

FCA-regulated Account Information Service Provider (AISP) under PSR 2017 (FCA Firm Registration Number 911236). Originally built for conveyancing AML/KYC, expanded into family law.

**How it works:** Clients connect bank accounts via Open Banking. Armalytix gathers 12 months of transactions across all connected accounts. Analyses income, fixed outgoings, expenditure categories, flags suspicious/unusual transactions. Can also ingest PDF statements and CSVs where Open Banking isn't available.

**Family law usage:** Makes users "Form E ready in moments." Hay & Kilner reported consolidating 30 minutes to 4 hours of manual work per matter into under 10 minutes. Used by firms responsible for 1 in 8 residential property transactions in E&W (for conveyancing).

**Positioning:** B2B tool sold to law firms, not directly consumer-facing. This is Decouple's key differentiation — consumer-first.

**Pricing:** Not publicly listed. Usage-based model, requires direct contact.

### Open Banking data vs PDF upload

Open Banking (via PSD2 Account Information Services) provides: real-time account balances, transaction history (typically 12–24 months), account holder identity verification, and enriched/categorised transaction data with merchant identification.

**Key advantage:** Structured from source — no OCR or parsing errors. TrueLayer covers 99% of UK consumer bank accounts.

**Key limitation:** Requires active consent from account holder. Problematic in adversarial proceedings where a party is reluctant to disclose.

### Data (Use and Access) Act 2025

Royal Assent 19 June 2025. Establishes a "Smart Data" framework placing Open Banking on permanent legal footing and extending toward **Open Finance**. FCA to publish Open Finance Roadmap by March 2026. Government targets 20+ Smart Data schemes by 2035.

**Strategic implication for Decouple:** Open Finance could enable access to pensions, investments, and insurance data — not just current accounts. Building on Open Banking now positions the product to expand data sources as regulation permits.

---

## 3. Competitor landscape

### The gap remains: no single tool owns the full workflow

| Product | What it does | What it doesn't | Consumer-facing? |
|---------|-------------|-----------------|-----------------|
| **Armalytix** | Open Banking data, 12-month analysis, Form E-ready reports | No Form E builder, no guided workflow, no pension/property handling | No (B2B to law firms) |
| **Splitifi** | AI "Divorce Operating System", Form E builder, calculators, AI coach | US-origin, UK adaptation newer/less proven, USD-centric | Yes |
| **LEAP** | Full practice management, integrated Financial Statement app, e-signing | Full PMS not consumer tool, no document extraction AI | No (B2B to solicitors) |
| **Clio** | Case management, document management, Clio Draft | No dedicated Form E builder or financial disclosure workflow | No (B2B to solicitors) |
| **adieu.ai** | AI paralegal for family law, autonomous disclosure sourcing, 10-min initial disclosure | Australian origin, UK availability unconfirmed | No (B2B to firms) |
| **Amicable** | Fixed-price service, document automation, interactive triage | Joint-couple model (not individual), no standalone Form E tool | Partial (service, not tool) |
| **SeparateSpace** | Personalised dashboard, guides, templates, workshops (£25–39/mo) | Guidance not operational tool, no financial data extraction | Yes |
| **Divorce Finance Toolkit** | Calculators, guidance, auto Form E production | Available via lawyers, limited consumer direct access | Partial |
| **Advicenow** | Free step-by-step Form E guide for LiPs | Guidance only, no interactive tool | Yes (free) |

**Decouple's position:** The only consumer-first, workspace-led product combining document upload, AI extraction, guided disclosure, and Form E-equivalent output. No competitor occupies this exact space.

### The Dext pattern

Dext (formerly Receipt Bank) demonstrates the UX pattern that works for financial document extraction:

1. **Upload** — mobile, email, drag-and-drop (PDF/scan/digital)
2. **Extract** — AI-powered, under 30 seconds, 99%+ claimed accuracy
3. **Review** — original document side-by-side with extracted data, inline editing
4. **Approve** — explicit confirmation before data is "committed"
5. **Publish** — approved data flows to downstream systems

**Key lesson:** Users accept AI extraction when the original document remains accessible alongside extracted data, there's an explicit review step, accuracy is high enough that review is confirmation not correction, and multiple input formats are handled.

---

## 4. Regulatory landscape

### SRA (Solicitors Regulation Authority)

Principles-based, not prescriptive. Key points:
- Solicitor's professional duties apply regardless of technology used
- COLPs must oversee regulatory compliance for new technology
- GenAI adoption among law firms rose from 14% (2024) to 26% (2025)
- Research found practitioners considered AI less suitable for complex matters like divorce than administrative tasks

**Implication:** Decouple's output must be compatible with solicitor workflows. If a solicitor will rely on the data, it must be clear, auditable, and traceable to source documents.

### FCA (Financial Conduct Authority)

Any tool accessing bank account data via Open Banking must be FCA-authorised as an AISP under PSR 2017. Requirements: granular permissions, time-limited consent, instant revocation, full audit trails. AISPs are data controllers (not just processors), carrying full GDPR responsibility.

**For Decouple now:** PDF upload does not require FCA authorisation. Open Banking integration (future) would require either FCA registration or partnership with a regulated provider (TrueLayer, Plaid, Armalytix).

### UK GDPR / Data Protection

Financial data in divorce involves multiple considerations:
- **Lawful basis:** Likely legitimate interests (requires three-part test: purpose, necessity, balancing) or contract
- **Special category data:** Health information may appear in financial records; transaction patterns could reveal racial/ethnic origin
- **The balancing test:** For a tool handling one party's data where the other may be adversely affected, the balancing test under legitimate interests is particularly important
- **Data minimisation:** Only process what's needed
- **Transparency:** Clear privacy notices about what's processed and why

### NCDR regulatory changes (April 2024)

Changes to Family Procedure Rules from 29 April 2024 require parties in financial remedy or private children proceedings to consider Non-Court Dispute Resolution. Courts can make costs orders against parties who fail to attend MIAM or engage in NCDR without good reason.

**Strategic implication:** Creates regulatory tailwind for tools facilitating out-of-court financial disclosure and resolution. Decouple sits naturally in this space.

### Resolution standards

Resolution Together (launched 2022): "one lawyer, two clients" model. Over 580 practitioners trained by late 2024. Requires both parties to be transparent about finances. Resolution's position: duty of full disclosure should start when parties engage in NCDR, not only when court proceedings begin.

---

## 5. Key findings — what V2's technology must deliver

1. **LLM extraction is production-ready.** 97–98% accuracy on text PDFs, with structured outputs eliminating JSON truncation. V2 should upgrade to Anthropic's structured outputs to solve the current truncation workaround.

2. **The Dext side-by-side pattern is the proven UX.** Upload → extract → review alongside original → approve. This is what spec 09 describes and what V2 needs to build.

3. **Confidence scoring should be three-tier at minimum.** Auto-accept (≥0.95), confirm (0.80–0.95), manual (<0.80). Financial documents warrant conservative thresholds.

4. **Multi-document intelligence is the differentiation.** Matching income across payslip/bank statement/P60, verifying mortgage payments, flagging discrepancies. No consumer tool does this.

5. **Open Banking is the future, PDF is the present.** FCA authorisation required for Open Banking. Build on PDF extraction now; design the architecture to accept structured Open Banking data when ready.

6. **Armalytix is the closest competitor** but is B2B. Consumer-first positioning is Decouple's moat.

7. **The Data Use and Access Act 2025 is a strategic tailwind.** Open Finance coming. Design data models to accommodate pension and investment data feeds.

8. **No FCA authorisation needed for current scope** (PDF upload + AI extraction). Required only if/when Open Banking integration is added.

9. **GDPR requires documented lawful basis, transparency, and data minimisation.** The balancing test for legitimate interests is critical given the adversarial nature of divorce disclosure.

10. **The Express Pilot and digital submission mandate mean V2's output must be court-ready PDF.** The Summary tab export should produce Form E-equivalent structured output.

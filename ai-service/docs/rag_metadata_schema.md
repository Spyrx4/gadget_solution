---
source: gadget_solution
doc_type: metadata_schema
version: 1.0
lang: en
tags: [metadata, schema, ingestion, filter, category, price, stock, use_case]
chunk_strategy: reference_only
---

# METADATA SCHEMA — GADGET SOLUTION RAG

> Reference document for the development team.
> Defines the metadata fields stored alongside each chunk in pgvector.
> This metadata enables pre-filtering before similarity search,
> resulting in more precise retrieval and lower token usage.

---

## [SCHEMA-001] Metadata Fields Per Product

Each product chunk embedded into pgvector stores the following metadata:

| Field | Type | Example Value | Filter Purpose |
|---|---|---|---|
| `product_id` | string | `"clxxx123"` | Lookup to Product table |
| `product_name` | string | `"ASUS ROG Zephyrus G14"` | Display in AI response |
| `category` | string | `"laptop"` | Filter by category |
| `brand` | string | `"ASUS"` | Filter by brand |
| `price` | number | `34500000` | Filter by budget |
| `price_range` | string | `"premium"` | Quick budget filter |
| `stock_status` | string | `"low_stock"` | Avoid recommending out-of-stock items |
| `use_cases` | array | `["gaming_aaa","ai_data_science"]` | Filter by customer need |
| `gpu_vram_gb` | integer | `12` | Filter by VRAM requirement |
| `ram_gb` | integer | `32` | Filter by RAM requirement |
| `has_ssd` | boolean | `true` | Filter by storage requirement |

---

## [SCHEMA-002] Allowed Values Per Field

**`price_range`:**
- `budget` — price below IDR 5,000,000
- `mid_range` — price IDR 5,000,000 – IDR 20,000,000
- `premium` — price above IDR 20,000,000

**`stock_status`:**
- `in_stock` — stock > 3 units
- `low_stock` — stock 1–3 units (show warning to customer)
- `out_of_stock` — stock 0 (do not recommend)

**`use_cases` (can have more than one):**
- `gaming_aaa` — demanding PC games such as Cyberpunk, Elden Ring
- `mobile_gaming` — competitive smartphone games
- `ai_data_science` — PyTorch, model training, data preprocessing
- `content_creation` — video editing, graphic design
- `portability` — lightweight laptop for high mobility
- `general_use` — everyday general usage

**`category` (follows Product table categories):**
- `smartphone_gaming`
- `laptop_gaming`
- `laptop_creator`
- `accessories`
- `components`

---

## [SCHEMA-003] Pre-Filter Query Examples

Examples of using metadata to narrow results before similarity search:

**Scenario: User asks "laptop for AI, budget max 40 million"**
```
Filter: category IN ["laptop_gaming", "laptop_creator"]
        AND price <= 40000000
        AND stock_status != "out_of_stock"
        AND "ai_data_science" IN use_cases
Then: similarity search on filtered results
```

**Scenario: User asks "affordable gaming phone"**
```
Filter: category = "smartphone_gaming"
        AND price_range IN ["budget", "mid_range"]
        AND stock_status != "out_of_stock"
Then: similarity search on filtered results
```

**Scenario: User asks "best gaming laptop" with no budget constraint**
```
Filter: category IN ["laptop_gaming"]
        AND stock_status != "out_of_stock"
        AND "gaming_aaa" IN use_cases
Then: similarity search, sort by price DESC (premium first)
```

---

## [SCHEMA-004] Re-Embedding Triggers

Embeddings must be regenerated when:

- Product name changes
- Product description changes
- `techSpecs` (JSONB) changes
- Price changes significantly (moves to a different `price_range`)
- Stock status changes (especially to `out_of_stock`)

Re-embedding is NOT necessary if only:
- Product images change
- Stock count changes but remains within the same `stock_status` category

---

*— End of Metadata Schema —*

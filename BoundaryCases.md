# Boundary Value Analysis (BVA)

| Case ID | Feature      | Field/Context   | Test Value           | Target Boundary  | Expected Result         |
| :------ | :----------- | :-------------- | :------------------- | :--------------- | :---------------------- |
| BVA-01  | Registration | Name Length     | "Amit" (4 chars)     | Min - 1          | Fail (Validation Error) |
| BVA-02  | Registration | Name Length     | "Amitt" (5 chars)    | Min Boundary     | Pass                    |
| BVA-03  | Registration | Name Length     | 24 characters string | Max Boundary     | Pass                    |
| BVA-04  | Registration | Name Length     | 25 characters string | Max + 1          | Fail (Validation Error) |
| BVA-05  | Registration | Password Length | "12345" (5 chars)    | Min - 1          | Fail (Validation Error) |
| BVA-06  | Registration | Password Length | "123456" (6 chars)   | Min Boundary     | Pass                    |
| BVA-07  | Registration | Rate-Limiting   | 10 requests / hr     | Safe Limit       | Pass                    |
| BVA-08  | Registration | Rate-Limiting   | 11 requests / hr     | Limit Breached   | Fail (HTTP 429)         |
| BVA-09  | Registration | Email Format    | " a@b.com "          | Spaces handling  | Pass (Auto-trimmed)     |
| BVA-10  | Registration | Email Format    | 254 characters email | System Max Limit | Pass                    |

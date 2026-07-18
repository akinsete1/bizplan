// lib/documentGenerator.ts — Professional document generator

export interface FormData {
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  location: string;
  state: string;
  ownerType: string;
  // Step 2: Business
  businessName: string;
  businessType: string;
  industry: string;
  businessLocation: string;
  yearEstablished: string;
  employees: string;
  businessDescription: string;
  // Step 3: Business Idea
  problemSolved: string;
  targetCustomers: string;
  productsServices: string;
  uniqueValue: string;
  // Step 4: Funding
  amountNeeded: string;
  fundingPurpose: string;
  fundingType: string;
  fundingBreakdown: { item: string; amount: string }[];
  // Step 5: Financial
  monthlyRevenue: string;
  monthlyExpenses: string;
  costOfGoods: string;
  staffSalaries: string;
  rent: string;
  marketingBudget: string;
  otherExpenses: string;
  // Step 6: Goals
  goals12Months: string;
  goals3Years: string;
  jobsCreated: string;
  fundingImpact: string;
  templateId: string;
  templateTitle: string;
}

function formatNaira(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  if (isNaN(num)) return '₦0';
  return `₦${num.toLocaleString('en-NG')}`;
}

function calculateFinancials(data: FormData) {
  const parse = (val: string) => parseFloat(val?.replace(/,/g, '') || '0') || 0;
  const monthlyRev = parse(data.monthlyRevenue);
  const cogs = parse(data.costOfGoods);
  const staffCost = parse(data.staffSalaries);
  const rentCost = parse(data.rent);
  const mktCost = parse(data.marketingBudget);
  const otherCost = parse(data.otherExpenses);

  const totalMonthlyExpenses = cogs + staffCost + rentCost + mktCost + otherCost;
  const monthlyProfit = monthlyRev - totalMonthlyExpenses;
  const annualRevenue = monthlyRev * 12;
  const annualProfit = monthlyProfit * 12;
  const profitMargin = monthlyRev > 0 ? ((monthlyProfit / monthlyRev) * 100).toFixed(1) : '0';

  // Break-even estimate
  const fundingAmount = parse(data.amountNeeded);
  const breakEvenMonths = monthlyProfit > 0 ? Math.ceil(fundingAmount / monthlyProfit) : 'N/A';

  return {
    totalMonthlyExpenses,
    monthlyProfit,
    annualRevenue,
    annualProfit,
    profitMargin,
    breakEvenMonths,
  };
}

export function generateDocument(data: FormData): string {
  const fin = calculateFinancials(data);
  const currentYear = new Date().getFullYear();
  const fundingBreakdownTotal = data.fundingBreakdown
    ?.reduce((sum, item) => sum + (parseFloat(item.amount?.replace(/,/g, '') || '0') || 0), 0) || 0;

  return `
# ${data.businessName || 'Business Name'}
## ${data.templateTitle || 'Business Plan'}

**Prepared by:** ${data.fullName || 'Business Owner'}
**Date:** ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
**Document Type:** ${data.templateTitle}

---

## SECTION 1: EXECUTIVE SUMMARY

${data.businessName} is a ${data.businessType?.toLowerCase() || 'business'} operating in the ${data.industry || 'relevant'} sector, ${data.businessLocation ? `based in ${data.businessLocation}, ` : ''}${data.state ? `${data.state} State, ` : ''}Nigeria. The business was ${data.yearEstablished ? `established in ${data.yearEstablished}` : 'recently established'} and currently ${data.employees ? `employs ${data.employees} staff member(s)` : 'is in its growth phase'}.

${data.businessDescription || `${data.businessName} is committed to delivering excellent products and services to Nigerian consumers.`}

This document presents a comprehensive business plan outlining our business model, market opportunity, operational strategy, and financial projections. We are seeking funding of **${formatNaira(data.amountNeeded)}** to ${data.fundingPurpose || 'support business growth and operations'}.

**Key Highlights:**
- Business: ${data.businessName}
- Industry: ${data.industry}
- Funding Requested: ${formatNaira(data.amountNeeded)}
- Projected Annual Revenue: ${formatNaira(fin.annualRevenue)}
- Projected Annual Profit: ${formatNaira(fin.annualProfit)}
- Profit Margin: ${fin.profitMargin}%

---

## SECTION 2: BUSINESS OVERVIEW

**Business Name:** ${data.businessName}
**Business Type:** ${data.businessType}
**Industry:** ${data.industry}
**Location:** ${data.businessLocation}${data.state ? `, ${data.state} State` : ''}
**Year Established:** ${data.yearEstablished || currentYear}
**Number of Employees:** ${data.employees || 'To be determined'}
**Business Owner:** ${data.fullName}
**Contact Email:** ${data.email}
**Phone:** ${data.phone}

### Company Description

${data.businessDescription || `${data.businessName} is a dynamic business that is committed to providing quality products and services to customers in ${data.businessLocation || 'Nigeria'}. Our business model is designed to be sustainable, scalable, and profitable.`}

---

## SECTION 3: PROBLEM AND OPPORTUNITY

### The Problem We Solve

${data.problemSolved || `There is a significant gap in the market that ${data.businessName} is uniquely positioned to address. Nigerian consumers face challenges in accessing quality, affordable, and reliable products and services in the ${data.industry} sector.`}

### Market Opportunity

Nigeria's growing economy and population present an enormous opportunity for businesses in the ${data.industry} sector. With over 200 million people and a rapidly growing middle class, the demand for quality products and services continues to grow. ${data.businessName} is strategically positioned to capture a significant share of this market.

---

## SECTION 4: PRODUCTS AND SERVICES

${data.productsServices || `${data.businessName} offers a comprehensive range of products and services designed to meet the needs of our target customers. Our offerings are carefully curated to provide maximum value while maintaining the highest standards of quality.`}

### Key Offerings:
- Premium quality products and services in the ${data.industry} sector
- Excellent customer service and after-sales support
- Competitive pricing designed for the Nigerian market
- Convenient access and delivery options

---

## SECTION 5: TARGET MARKET

### Primary Customers

${data.targetCustomers || `Our primary target market includes Nigerian consumers and businesses who require quality products and services in the ${data.industry} sector. We focus on individuals and organisations within ${data.businessLocation || 'our operational area'} and the surrounding regions.`}

### Market Segmentation
- **Primary Segment:** Individual consumers and small businesses
- **Secondary Segment:** Corporate clients and institutional buyers
- **Geographic Focus:** ${data.state || 'Lagos'} State and surrounding areas

---

## SECTION 6: MARKET ANALYSIS

The Nigerian ${data.industry} market is experiencing significant growth, driven by increasing consumer demand, urbanisation, and technological advancement. Key market factors include:

- **Growing Middle Class:** Nigeria's expanding middle class has increased disposable income and spending power
- **Urbanisation:** Rapid urban growth is driving demand for quality products and services
- **Digital Transformation:** Increasing smartphone and internet penetration is creating new market opportunities
- **Government Support:** Federal and state government initiatives support SME growth

**Market Size:** The Nigerian ${data.industry} sector represents a multi-billion Naira opportunity with consistent annual growth.

---

## SECTION 7: COMPETITIVE ADVANTAGE

### What Makes ${data.businessName} Different

${data.uniqueValue || `${data.businessName} differentiates itself through superior quality, exceptional customer service, competitive pricing, and deep understanding of the Nigerian market. Our team's expertise and commitment to excellence give us a distinct advantage over competitors.`}

### Key Competitive Advantages:
1. **Local Expertise:** Deep understanding of Nigerian consumer needs and preferences
2. **Quality Commitment:** Maintaining the highest standards of quality in all our offerings
3. **Competitive Pricing:** Providing excellent value for money to our Nigerian customers
4. **Customer Focus:** Building long-term relationships through excellent customer service
5. **Agility:** Ability to adapt quickly to market changes and customer feedback

---

## SECTION 8: MARKETING STRATEGY

### Marketing Approach

${data.businessName} will implement a multi-channel marketing strategy to reach and retain customers across our target market segments.

**Digital Marketing:**
- Social media marketing (Facebook, Instagram, Twitter, LinkedIn)
- WhatsApp Business for customer communication and sales
- Google Ads and online advertising
- Website and e-commerce presence

**Traditional Marketing:**
- Word-of-mouth and referral programmes
- Local community engagement and events
- Flyers, banners, and print advertising
- Partnerships with local businesses and organisations

**Monthly Marketing Budget:** ${formatNaira(data.marketingBudget)}

---

## SECTION 9: OPERATIONS PLAN

### Operational Structure

${data.businessName} operates from ${data.businessLocation || 'our business location'}, with the following operational framework:

- **Daily Operations:** [Standard operating procedures for daily business activities]
- **Quality Control:** Strict quality management processes to ensure consistent service delivery
- **Supply Chain:** Reliable supplier relationships to ensure consistent product availability
- **Technology:** Use of appropriate technology tools to enhance efficiency and customer experience

### Staffing
- **Current Team:** ${data.employees || 'Lean team'} employee(s)
- **Planned Recruitment:** Additional staff to be hired as business grows

---

## SECTION 10: MANAGEMENT TEAM

### Business Owner/Director

**Name:** ${data.fullName}
**Role:** Founder & Managing Director
**Location:** ${data.location || data.businessLocation}

${data.fullName} brings entrepreneurial passion and commitment to building ${data.businessName} into a successful and sustainable business. With a deep understanding of the Nigerian market and a clear vision for growth, ${data.fullName.split(' ')[0]} leads the business with focus, integrity, and determination.

---

## SECTION 11: FUNDING REQUEST

### Funding Summary

**Amount Requested:** ${formatNaira(data.amountNeeded)}
**Funding Type:** ${data.fundingType || 'Business Loan/Grant'}
**Purpose:** ${data.fundingPurpose || 'Business growth and development'}

### Justification

This funding will provide ${data.businessName} with the capital needed to ${data.fundingImpact || `accelerate growth, expand operations, and strengthen our position in the ${data.industry} market`}.

---

## SECTION 12: USE OF FUNDS

${data.fundingBreakdown && data.fundingBreakdown.length > 0 ? `
The requested funding of ${formatNaira(data.amountNeeded)} will be allocated as follows:

| Item | Amount (₦) |
|------|-----------|
${data.fundingBreakdown.filter(b => b.item && b.amount).map(b => `| ${b.item} | ${formatNaira(b.amount)} |`).join('\n')}
| **TOTAL** | **${formatNaira(fundingBreakdownTotal)}** |

Each allocation has been carefully considered to maximise the impact of the investment and accelerate business growth.
` : `
The funding will be strategically deployed to:
1. **Business Infrastructure** — Setting up and improving operational infrastructure
2. **Working Capital** — Maintaining adequate stock and meeting operational costs
3. **Marketing** — Building brand awareness and customer acquisition
4. **Equipment** — Acquiring necessary equipment for business operations
5. **Staffing** — Recruiting and training qualified staff

**Total Funding Required:** ${formatNaira(data.amountNeeded)}
`}

---

## SECTION 13: FINANCIAL PROJECTIONS

### Monthly Financial Summary

| Item | Amount |
|------|--------|
| Monthly Revenue | ${formatNaira(data.monthlyRevenue)} |
| Cost of Goods | ${formatNaira(data.costOfGoods)} |
| Staff Salaries | ${formatNaira(data.staffSalaries)} |
| Rent & Utilities | ${formatNaira(data.rent)} |
| Marketing Budget | ${formatNaira(data.marketingBudget)} |
| Other Expenses | ${formatNaira(data.otherExpenses)} |
| **Total Monthly Expenses** | **${formatNaira(fin.totalMonthlyExpenses)}** |
| **Monthly Profit** | **${formatNaira(fin.monthlyProfit)}** |

### Annual Projections

| Metric | Year 1 |
|--------|--------|
| Annual Revenue | ${formatNaira(fin.annualRevenue)} |
| Annual Expenses | ${formatNaira(fin.totalMonthlyExpenses * 12)} |
| Annual Profit | ${formatNaira(fin.annualProfit)} |
| Profit Margin | ${fin.profitMargin}% |
| Break-even Period | ${fin.breakEvenMonths} month(s) |

### Revenue Growth Projections

| Year | Projected Revenue | Projected Profit |
|------|------------------|-----------------|
| Year 1 | ${formatNaira(fin.annualRevenue)} | ${formatNaira(fin.annualProfit)} |
| Year 2 | ${formatNaira(fin.annualRevenue * 1.3)} | ${formatNaira(fin.annualProfit * 1.4)} |
| Year 3 | ${formatNaira(fin.annualRevenue * 1.7)} | ${formatNaira(fin.annualProfit * 2)} |

---

## SECTION 14: RISK ANALYSIS

### Identified Risks and Mitigation Strategies

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|-----------|--------|-------------------|
| Economic Downturn | Medium | High | Diversify revenue streams, maintain cost efficiency |
| Currency Fluctuation | Medium | Medium | Local sourcing where possible, maintain forex reserves |
| Competition | High | Medium | Differentiation through quality and customer service |
| Regulatory Changes | Low | High | Stay updated with regulations, engage legal counsel |
| Cash Flow Challenges | Medium | High | Maintain cash reserves, offer flexible payment terms |

---

## SECTION 15: GROWTH STRATEGY

### 12-Month Goals

${data.goals12Months || `Within the first 12 months, ${data.businessName} aims to establish a strong market presence, build a loyal customer base, and achieve consistent monthly profitability. Key milestones include launching operations, onboarding our first 100 customers, and reaching monthly revenue of ${formatNaira(data.monthlyRevenue)}.`}

### 3-Year Vision

${data.goals3Years || `By the end of Year 3, ${data.businessName} aims to expand operations across multiple locations in ${data.state || 'Lagos'} State and other key Nigerian markets. We envision becoming one of the leading businesses in the ${data.industry} sector, with a strong brand reputation and sustainable growth.`}

---

## SECTION 16: SOCIAL IMPACT

### Job Creation

${data.businessName} is committed to contributing to Nigeria's economic development through job creation and community support.

- **Jobs to be Created:** ${data.jobsCreated || '5-10'} direct employment opportunities
- **Indirect Employment:** Additional livelihoods supported through supply chain and related businesses
- **Skills Development:** Investment in staff training and capacity building

### Community Impact

By establishing and growing ${data.businessName}, we contribute to:
- Local economic development and wealth creation
- Empowerment of community members through employment
- Provision of quality products and services to the community
- Tax contribution to support government development initiatives

---

## SECTION 17: CONCLUSION

${data.businessName} represents a compelling business opportunity with strong market potential, a clear operational plan, and realistic financial projections. The requested funding of ${formatNaira(data.amountNeeded)} will catalyse significant business growth and enable us to achieve our ambitious but achievable goals.

${data.fundingImpact || `With this funding support, ${data.businessName} will create jobs, generate wealth, and contribute meaningfully to Nigeria's economic development. We are confident in our ability to deliver returns, repay any obligations, and build a business that stands as a model of Nigerian entrepreneurial excellence.`}

We appreciate your consideration and look forward to a mutually beneficial partnership.

---

**Prepared by:** ${data.fullName}
**Business:** ${data.businessName}
**Contact:** ${data.email} | ${data.phone}
**Date:** ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}

*This document was prepared using BizPlan Nigeria — Nigeria's leading business planning platform.*

---

*© ${currentYear} ${data.businessName}. All rights reserved. This document is confidential and intended solely for the designated recipient.*
`;
}

export function calculateFinancialsPublic(data: Partial<FormData>) {
  return calculateFinancials(data as FormData);
}

// lib/blogData.ts — Blog posts and categories

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  emoji: string;
  featured: boolean;
  content: string;
}

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'business-funding', label: 'Business Funding' },
  { id: 'grants', label: 'Grants' },
  { id: 'business-loans', label: 'Business Loans' },
  { id: 'entrepreneurship', label: 'Entrepreneurship' },
  { id: 'nigerian-smes', label: 'Nigerian SMEs' },
  { id: 'business-plans', label: 'Business Plans' },
  { id: 'startup-advice', label: 'Startup Advice' },
  { id: 'financial-management', label: 'Financial Management' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-write-business-plan-nigeria',
    title: 'How to Write a Business Plan in Nigeria (2025 Complete Guide)',
    excerpt: 'Learn everything you need to know about writing a winning business plan in Nigeria — from executive summary to financial projections, with real Nigerian examples.',
    category: 'business-plans',
    readTime: '12 min read',
    publishedAt: '2025-07-10',
    emoji: '📋',
    featured: true,
    content: `A business plan is your business roadmap — it tells the story of your business, where it is going, and how you will get there. In Nigeria, a well-written business plan is essential for securing bank loans, government grants, and investor funding.\n\n## What is a Business Plan?\n\nA business plan is a written document that describes your business, your products or services, your target market, your competition, your marketing strategy, and your financial projections.\n\n## Why Do You Need a Business Plan in Nigeria?\n\nNigerian entrepreneurs need business plans for many reasons:\n\n- **Bank Loans:** Nigerian banks like GTBank, Access Bank, and Zenith Bank require a business plan before approving SME loans\n- **Government Grants:** Programmes like BOI, NIRSAL, and NYIF require a structured business plan\n- **TEF Programme:** The Tony Elumelu Foundation requires a business plan as part of the application\n- **Investor Pitches:** Angel investors and VCs expect a detailed business plan\n\n## Key Sections of a Nigerian Business Plan\n\n1. **Executive Summary** — Overview of your entire business plan\n2. **Business Overview** — Company details, location, registration\n3. **Problem and Opportunity** — The market gap you are filling\n4. **Products and Services** — What you sell\n5. **Target Market** — Who your customers are\n6. **Market Analysis** — Nigerian market research\n7. **Marketing Strategy** — How you will attract customers\n8. **Operations Plan** — How the business runs\n9. **Financial Projections** — Revenue, expenses, and profit in Naira`,
  },
  {
    id: '2',
    slug: 'how-to-apply-business-grants-nigeria',
    title: 'How to Apply for Business Grants in Nigeria (2025 Guide)',
    excerpt: 'Discover the best business grants available in Nigeria in 2025, including government grants, foundation grants, and NGO funding opportunities for entrepreneurs.',
    category: 'grants',
    readTime: '10 min read',
    publishedAt: '2025-07-05',
    emoji: '🏛️',
    featured: true,
    content: `Nigeria has several grant programmes available for entrepreneurs, startups, youth, and women-led businesses. This guide covers the most important ones and how to apply.\n\n## Top Business Grants in Nigeria\n\n### 1. Tony Elumelu Foundation (TEF) Grant\nThe TEF Entrepreneurship Programme provides $5,000 (USD) in non-refundable seed capital to African entrepreneurs. The application opens annually and is highly competitive.\n\n### 2. NYIF — Nigeria Youth Investment Fund\nThe NYIF provides funding of ₦250,000 to ₦3,000,000 for Nigerian youth entrepreneurs aged 18–35.\n\n### 3. BOI — Bank of Industry\nBOI offers affordable loans and grants to SMEs across various sectors including agriculture, manufacturing, and technology.\n\n### 4. NIRSAL Microfinance Bank\nNIRSAL provides agricultural and business financing solutions for Nigerian farmers and agribusinesses.\n\n## Tips for a Winning Grant Application\n\n1. **Read the eligibility criteria carefully** — Each grant has specific requirements\n2. **Write a compelling problem statement** — Explain why your business matters\n3. **Show social impact** — Grants favour businesses that create jobs\n4. **Be specific about your budget** — Show exactly how you will use the money\n5. **Proofread your application** — Grammatical errors are a red flag`,
  },
  {
    id: '3',
    slug: 'business-plan-for-bank-loan-nigeria',
    title: 'How to Prepare a Business Plan for a Bank Loan in Nigeria',
    excerpt: 'Nigerian banks require specific documents and financial information. Learn what banks look for in a business plan and how to structure your loan application.',
    category: 'business-loans',
    readTime: '9 min read',
    publishedAt: '2025-06-28',
    emoji: '🏦',
    featured: false,
    content: `Getting a bank loan in Nigeria requires more than just a good business idea. Banks need to see a structured business plan with detailed financial projections and evidence of repayment capacity.\n\n## What Nigerian Banks Look For\n\n1. **Registered Business** — CAC registration is usually required\n2. **Business Bank Account** — Active account with 6+ months statement\n3. **Financial Projections** — Monthly revenue, expenses, and profit\n4. **Cash Flow Statement** — Showing ability to repay\n5. **Collateral** — Asset security for the loan\n6. **Business Plan** — Comprehensive written document\n\n## Structure of a Bank Loan Proposal\n\n- Business Profile\n- Loan Amount and Purpose\n- Repayment Plan\n- Cash Flow Forecast\n- Collateral Details\n- Owner Financial Information`,
  },
  {
    id: '4',
    slug: 'tony-elumelu-foundation-programme',
    title: 'How to Apply for the Tony Elumelu Foundation Entrepreneurship Programme',
    excerpt: 'The TEF Programme is one of Africa\'s most prestigious entrepreneurship grants. Learn exactly how to apply and what makes a winning application.',
    category: 'grants',
    readTime: '11 min read',
    publishedAt: '2025-06-20',
    emoji: '🌟',
    featured: true,
    content: `The Tony Elumelu Foundation (TEF) Entrepreneurship Programme is one of the most prestigious entrepreneurship programmes in Africa. Each year, TEF selects entrepreneurs from across Africa and provides them with $5,000 seed capital, mentorship, and business training.\n\n## Key Facts About TEF 2025\n\n- **Funding:** $5,000 USD non-refundable seed capital\n- **Training:** 12-week online training programme\n- **Mentorship:** 1:1 mentorship from successful African entrepreneurs\n- **Network:** Access to TEF alumni network\n\n## Eligibility Requirements\n\n- African entrepreneur aged 18 and above\n- Business idea must be based in Africa\n- Business must be less than 3 years old (for some tracks)\n- Must complete online application form\n\n## How to Write a Winning TEF Application\n\n1. **Be specific about your problem** — Don't be vague\n2. **Show innovation** — TEF looks for creative solutions\n3. **Demonstrate social impact** — Jobs creation, community benefit\n4. **Be realistic about financials** — Use real numbers\n5. **Show passion** — Let your enthusiasm show through your writing`,
  },
  {
    id: '5',
    slug: 'best-business-ideas-nigeria',
    title: 'Top 20 Best Business Ideas in Nigeria for 2025',
    excerpt: 'Looking for a profitable business to start in Nigeria? Here are the 20 most viable business opportunities in Nigeria in 2025 with low startup capital.',
    category: 'entrepreneurship',
    readTime: '8 min read',
    publishedAt: '2025-06-15',
    emoji: '💡',
    featured: false,
    content: `Nigeria's large population and growing economy create many business opportunities. Here are the most profitable business ideas you can start in Nigeria today.\n\n## Top Business Ideas in Nigeria\n\n1. **Poultry Farming** — High demand, relatively low startup cost\n2. **Food Production** — NAFDAC-registered food products\n3. **POS Business** — Agent banking services\n4. **Fashion Design** — Aso-Ebi and ready-to-wear clothing\n5. **Mini Importation** — Source products from China and sell in Nigeria\n6. **Digital Marketing Agency** — Help businesses grow online\n7. **Catering Services** — Events and corporate catering\n8. **Cleaning Services** — Commercial and residential cleaning\n9. **Logistics / Delivery** — Last-mile delivery services\n10. **Tutoring / Education** — Online and offline teaching`,
  },
  {
    id: '6',
    slug: 'how-to-calculate-business-profit',
    title: 'How to Calculate Your Business Profit in Nigeria',
    excerpt: 'Learn the simple formulas to calculate gross profit, net profit, profit margin, and break-even point for your Nigerian business — with Naira examples.',
    category: 'financial-management',
    readTime: '7 min read',
    publishedAt: '2025-06-08',
    emoji: '📊',
    featured: false,
    content: `Understanding your business finances is critical for growth. Here are the key financial calculations every Nigerian entrepreneur should know.\n\n## Key Financial Formulas\n\n### Gross Profit\n**Gross Profit = Revenue – Cost of Goods Sold**\n\nExample: Revenue ₦500,000 – COGS ₦200,000 = Gross Profit ₦300,000\n\n### Net Profit\n**Net Profit = Revenue – Total Expenses**\n\nExample: Revenue ₦500,000 – Total Expenses ₦380,000 = Net Profit ₦120,000\n\n### Profit Margin\n**Profit Margin = (Net Profit ÷ Revenue) × 100**\n\nExample: (₦120,000 ÷ ₦500,000) × 100 = 24% profit margin\n\n### Break-Even Point\n**Break-Even = Fixed Costs ÷ (Revenue – Variable Costs per unit)**`,
  },
  {
    id: '7',
    slug: 'how-to-create-financial-projections',
    title: 'How to Create Financial Projections for Your Business Plan',
    excerpt: 'Financial projections are one of the most important parts of any business plan. Learn how to create realistic 3-year financial projections for a Nigerian business.',
    category: 'financial-management',
    readTime: '10 min read',
    publishedAt: '2025-05-30',
    emoji: '📈',
    featured: false,
    content: `Financial projections show investors, banks, and grant agencies how your business will perform financially. Here is how to create them correctly.\n\n## What Financial Projections Include\n\n1. **Revenue Forecast** — How much money you will make\n2. **Expense Budget** — What your costs will be\n3. **Profit & Loss Statement** — Revenue minus expenses\n4. **Cash Flow Statement** — When money comes in and goes out\n5. **Break-Even Analysis** — When you will become profitable\n\n## Steps to Create Financial Projections\n\n1. Start with your monthly revenue estimate\n2. List all your monthly expenses\n3. Calculate monthly profit\n4. Multiply monthly figures by 12 for annual projections\n5. Apply a realistic growth rate (10-30% for Nigerian SMEs)\n6. Create Year 1, Year 2, and Year 3 projections`,
  },
  {
    id: '8',
    slug: 'how-to-write-grant-proposal',
    title: 'How to Write a Professional Grant Proposal in Nigeria',
    excerpt: 'A step-by-step guide to writing a compelling grant proposal that gets approved. Includes templates, tips, and real examples for Nigerian grant applicants.',
    category: 'grants',
    readTime: '13 min read',
    publishedAt: '2025-05-22',
    emoji: '✍️',
    featured: false,
    content: `Writing a winning grant proposal requires more than just describing your business. You need to tell a compelling story about the problem you are solving and the impact you will create.\n\n## Key Sections of a Grant Proposal\n\n1. **Cover Letter** — Brief introduction to your organisation\n2. **Executive Summary** — One-page overview of your proposal\n3. **Problem Statement** — The challenge you are addressing\n4. **Proposed Solution** — Your approach to solving the problem\n5. **Project Objectives** — Specific, measurable goals\n6. **Target Beneficiaries** — Who will benefit\n7. **Implementation Plan** — How you will execute the project\n8. **Budget** — Detailed use of funds\n9. **Expected Outcomes** — Measurable impact\n10. **Sustainability Plan** — How the project continues after funding`,
  },
  {
    id: '9',
    slug: 'how-to-start-business-nigeria',
    title: 'How to Start a Business in Nigeria: Complete 2025 Guide',
    excerpt: 'Everything you need to know about starting a business in Nigeria — from business registration with CAC to getting your first customers.',
    category: 'entrepreneurship',
    readTime: '15 min read',
    publishedAt: '2025-05-15',
    emoji: '🚀',
    featured: false,
    content: `Starting a business in Nigeria requires careful planning, but the opportunity is enormous. With over 200 million people and a growing middle class, Nigeria offers excellent business opportunities.\n\n## Steps to Start a Business in Nigeria\n\n### Step 1: Choose Your Business Idea\nResearch your market, identify your competitors, and validate your idea.\n\n### Step 2: Write a Business Plan\nA business plan will guide your decisions and is required for most funding applications.\n\n### Step 3: Register Your Business with CAC\nThe Corporate Affairs Commission (CAC) is responsible for business registration in Nigeria.\n\n### Step 4: Open a Business Bank Account\nYou need a dedicated business bank account for your finances.\n\n### Step 5: Get Required Licences\nDepending on your industry, you may need NAFDAC, SON, or other regulatory approvals.\n\n### Step 6: Fund Your Business\nExplore options including personal savings, loans, grants, and investor funding.`,
  },
];

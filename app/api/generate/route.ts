import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';
import type { FormData } from '@/lib/documentGenerator';

export const maxDuration = 60; // Allow up to 60 seconds for generation

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let finalPrompt: string;

    // If a direct prompt string is passed (from tools like Grant/Loan builder), use it as-is
    if (body.prompt && typeof body.prompt === 'string') {
      finalPrompt = body.prompt;
    } else {
      // Otherwise treat it as FormData from the multi-step template flow
      const data: FormData = body;
      const formattedAmount = data.amountNeeded
        ? `₦${parseFloat(data.amountNeeded.replace(/,/g, '') || '0').toLocaleString('en-NG')}`
        : 'Not specified';

      finalPrompt = `
You are an expert business consultant and technical writer creating a professional business plan for a Nigerian entrepreneur.
Please generate a comprehensive, highly detailed, and compelling Business Plan based on the following information.
Format the output in clean Markdown. Do NOT wrap the entire output in a markdown code block (no \`\`\`markdown ... \`\`\`).
The tone should be professional, persuasive, and optimistic, suitable for presenting to investors or banks.

BUSINESS INFORMATION:
- Business Name: ${data.businessName}
- Industry: ${data.industry}
- Location: ${data.businessLocation}, ${data.state} State, Nigeria
- Owner: ${data.fullName}
- Year Established: ${data.yearEstablished || 'New Business'}
- Employees: ${data.employees}
- Description: ${data.businessDescription}

PROBLEM & SOLUTION:
- Problem Solved: ${data.problemSolved}
- Target Customers: ${data.targetCustomers}
- Products/Services: ${data.productsServices}
- Unique Value Proposition: ${data.uniqueValue}

FUNDING & GOALS:
- Funding Needed: ${formattedAmount}
- Funding Purpose: ${data.fundingPurpose}
- 12-Month Goals: ${data.goals12Months}
- 3-Year Vision: ${data.goals3Years}
- Expected Jobs Created: ${data.jobsCreated}
- Funding Impact: ${data.fundingImpact}

Please structure the document EXACTLY with these markdown headings (use ## for main sections):

# ${data.businessName || 'Business Name'}
## ${data.templateTitle || 'Business Plan'}

**Prepared by:** ${data.fullName || 'Business Owner'}
**Date:** ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## 1. Executive Summary
(Write a compelling 3-4 paragraph summary of the entire business, the opportunity, and the funding request)

## 2. Company Overview
(Detailed breakdown of the business structure, history, and mission)

## 3. The Problem & Market Opportunity
(Expand heavily on the problem they are solving in the Nigerian context and why the market is ready)

## 4. Products & Services
(Detail the offerings and the value they bring)

## 5. Target Market & Audience
(Analyze the demographic and psychographic profile of their customers)

## 6. Competitive Advantage
(Explain why this business will win against competitors)

## 7. Marketing & Sales Strategy
(How they will acquire customers, mentioning local Nigerian marketing channels if applicable)

## 8. Operations & Management
(How the business runs day-to-day and the strength of the founder)

## 9. Funding Request & Utilization
(Detail why they need ${formattedAmount} and how it will accelerate growth)

## 10. Future Vision & Social Impact
(Their 1-year and 3-year goals, plus the impact on job creation in their community)

## 11. Conclusion
(A strong, persuasive closing statement)

IMPORTANT INSTRUCTIONS:
- Expand on the provided details. Use your business expertise to fill in logical gaps and make the plan highly credible.
- Ensure the language is polished and professional British/Nigerian English (e.g., use "organisation" instead of "organization").
- Return ONLY the raw markdown text.
      `;
    }

    // Stream the response back using the Vercel AI SDK
    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: 'You are an expert business consultant and professional writer specialising in Nigerian business documents.',
      prompt: finalPrompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate document' }, { status: 500 });
  }
}

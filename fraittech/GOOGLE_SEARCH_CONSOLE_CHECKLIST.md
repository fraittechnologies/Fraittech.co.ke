# Google Search Console Setup Checklist

## Quick Start Guide for Fraittech.co.ke

### Phase 1: Initial Setup (Today)

#### [ ] Create Google Search Console Account
- [ ] Go to https://search.google.com/search-console
- [ ] Sign in with Google account
- [ ] Click "Add Property"
- [ ] Select "Web" option
- [ ] Enter domain: `https://fraittech.co.ke` (include https://)

#### [ ] Verify Ownership - Choose One Method:

**Option A: HTML File Upload (Recommended)**
- [ ] Download verification file from GSC
- [ ] Upload to root directory: `/verification-file.html`
- [ ] Click "Verify" in GSC

**Option B: Meta Tag (Already Implemented)**
- [ ] Copy meta tag from GSC
- [ ] Replace this in index.html (already placeholder):
  ```html
  <meta name="google-site-verification" content="[YOUR-CODE-HERE]">
  ```
- [ ] Click "Verify" in GSC

**Option C: Google Analytics Tag**
- [ ] If you have Google Analytics linked to your domain
- [ ] GSC can auto-verify using your GA code

#### [ ] Submit Sitemap
- [ ] In GSC, go to "Sitemaps" section (left menu)
- [ ] Click "New sitemap" button
- [ ] Enter: `sitemap.xml`
- [ ] Click "Submit"
- [ ] Wait for status to show "Success"

### Phase 2: Initial Data Collection (1-4 weeks)

#### [ ] Monitor Coverage Report
- [ ] Go to "Coverage" in left menu
- [ ] Should show pages as "Submitted" and "Indexed"
- [ ] Check for any errors or warnings
- [ ] Expected timeline: 2-7 days for initial indexing

#### [ ] Check Google Mobile-Friendly Test
- [ ] Go to Google Mobile-Friendly Test tool
- [ ] Enter: `https://fraittech.co.ke`
- [ ] Verify "Page is mobile friendly" message
- [ ] Fix any errors if found

#### [ ] Request URL Inspection
- [ ] Go to "URL Inspection" tool (top search box)
- [ ] Enter: `https://fraittech.co.ke`
- [ ] Review coverage status
- [ ] If "Excluded," check reason and fix
- [ ] Click "Request Indexing" if needed

### Phase 3: Optimization (Weeks 2-4)

#### [ ] Monitor Search Performance
- [ ] Go to "Performance" in left menu
- [ ] Check for search queries that bring traffic
- [ ] Identify pages with high impressions but low CTR
- [ ] Note pages with lower ranking positions

#### [ ] Fix Detected Issues
- [ ] Review "Coverage" errors
- [ ] Review "Enhancements" for rich snippets
- [ ] Address any technical issues

#### [ ] Improve Page Titles & Descriptions
- [ ] Check which pages get most impressions
- [ ] Improve title tags if CTR is below 3%
- [ ] Update meta descriptions if needed
- [ ] Re-request indexing for updated pages

#### [ ] Submit New Pages
- [ ] As you add new pages, request indexing:
  - [ ] Go to URL Inspection
  - [ ] Enter new page URL
  - [ ] Click "Request Indexing"

### Phase 4: Link & Backlink Strategy (Month 2-3)

#### [ ] Monitor Backlinks
- [ ] In GSC, go to "Links" section
- [ ] Review "Top linking sites"
- [ ] Review "Top linked pages"
- [ ] Monitor growth over time

#### [ ] Start Link Building
- [ ] Add link to your site from local Kenya business directories
- [ ] Create Google My Business listing (local SEO)
- [ ] Add links from social media profiles

#### [ ] Internal Linking
- [ ] Review "Top linked pages"
- [ ] Add internal links to pages with fewer backlinks
- [ ] Ensure logical site structure

### Phase 5: Ongoing Monitoring (Weekly)

#### [ ] Weekly Check-in (15 minutes)
- [ ] Check Coverage for new errors
- [ ] Review any critical issues
- [ ] Note new backlinks

#### [ ] Monthly Deep Dive (30 minutes)
- [ ] Review Performance report trends
- [ ] Check Search Analytics (queries, positions, CTR)
- [ ] Analyze and improve underperforming pages
- [ ] Monitor Core Web Vitals

#### [ ] Quarterly Comprehensive Review (1 hour)
- [ ] Full coverage audit
- [ ] Check mobile usability
- [ ] Review all error categories
- [ ] Assess link profile growth
- [ ] Plan content improvements

## Expected Results Timeline

| Timeframe | Expected Progress |
|-----------|------------------|
| Day 1-2 | Sitemap submitted, verification complete |
| Week 1 | Google crawls site, pages indexed |
| Week 2-4 | First search impressions appear |
| Month 1-2 | Keywords start ranking |
| Month 2-3 | Organic traffic begins flowing |
| Month 3-6 | Significant improvement in visibility |

## Performance Targets

### Phase 1 (Month 1)
- [ ] All pages indexed in Google
- [ ] 0 critical coverage errors
- [ ] Mobile-friendly status: Pass

### Phase 2 (Month 2)
- [ ] 50+ search impressions
- [ ] Average position < 50
- [ ] Click-through rate > 2%

### Phase 3 (Month 3)
- [ ] 200+ search impressions
- [ ] Average position < 30
- [ ] Organic traffic > 10 visitors/day
- [ ] At least 10 backlinks

### Phase 6+ (6 months)
- [ ] Significant organic traffic
- [ ] Multiple keywords ranking on page 1
- [ ] Average position < 10
- [ ] 50+ backlinks from quality sources

## Important Notes

### ⚠️ Important Reminders
1. **Google doesn't require submission** - It crawls robots.txt and sitemap automatically, but GSC submission speeds up the process
2. **Results take time** - SEO is a long-term strategy, expect 3-6 months for significant results
3. **Quality over speed** - Focus on quality content and natural backlinks, not quick ranking tricks
4. **Keep sitemap updated** - Add new pages to sitemap.xml when created
5. **Monitor continuously** - Regular monitoring helps identify issues early

### 🚫 Things to AVOID
- Don't keyword stuff
- Don't add pages to sitemap that return 404
- Don't use cloaking or hidden text
- Don't buy low-quality backlinks
- Don't over-optimize (keep content natural)

### ✅ Best Practices
- Keep content fresh and updated
- Create valuable, original content
- Build quality backlinks naturally
- Maintain fast page speed
- Use proper heading hierarchy
- Include descriptive image alt text
- Maintain consistent business information

## Tools & Resources

### Free Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### Third-Party Tools (Optional)
- Ahrefs (competitor analysis, backlinks)
- SEMrush (keyword research, rankings)
- Moz Pro (rank tracking, site audits)
- Screaming Frog (technical SEO audits)

## Support & Contact

For SEO questions or issues:
- [ ] Review this guide first
- [ ] Check Google Search Console Help Center
- [ ] Consider hiring SEO consultant if needed

---

**Date Created:** January 11, 2026
**Domain:** fraittech.co.ke
**Status:** Ready for Implementation

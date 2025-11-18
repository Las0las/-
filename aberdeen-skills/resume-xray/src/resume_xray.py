"""
Resume X-Ray Vision Skill
Advanced resume parsing and analysis with AI-powered insights

Features:
- Hidden skills detection from context
- Career trajectory analysis
- Job stability scoring
- Authenticity verification
- Cultural markers extraction
- Red flag detection
- Competitive intelligence
"""

import re
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import anthropic
from openai import OpenAI
import spacy
from collections import defaultdict
import numpy as np

# Load NLP model
try:
    nlp = spacy.load("en_core_web_lg")
except:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_lg"])
    nlp = spacy.load("en_core_web_lg")


@dataclass
class CareerPosition:
    """Individual career position"""
    title: str
    company: str
    start_date: datetime
    end_date: Optional[datetime]
    duration_months: int
    responsibilities: List[str]
    achievements: List[str]
    skills_used: List[str]
    level: str  # 'junior', 'mid', 'senior', 'lead', 'executive'


@dataclass
class ResumeXRayAnalysis:
    """Complete resume analysis results"""
    # Core data
    candidate_name: str
    email: str
    phone: str
    linkedin: Optional[str]

    # Advanced insights
    hidden_skills: List[Dict[str, Any]]
    career_trajectory: Dict[str, Any]
    stability_score: float
    authenticity_check: Dict[str, Any]
    cultural_markers: List[Dict[str, str]]
    red_flags: List[Dict[str, str]]
    competitive_intel: Dict[str, Any]

    # Scores
    overall_quality_score: float
    experience_level: str
    technical_depth_score: float
    leadership_score: float

    # Metadata
    analyzed_at: datetime
    confidence_score: float


class ResumeXRayVision:
    """Advanced resume analysis engine"""

    def __init__(self, anthropic_key: str, openai_key: str):
        self.claude = anthropic.Anthropic(api_key=anthropic_key)
        self.openai = OpenAI(api_key=openai_key)

        # Skill taxonomy for implicit skill detection
        self.skill_taxonomy = self._load_skill_taxonomy()

        # Red flag patterns
        self.red_flag_patterns = {
            'job_hopping': r'(\d+)\s*months?(?!\s*year)',
            'gaps': r'gap|break|sabbatical|unemployed',
            'overqualified': r'(phd|doctorate).*?(junior|entry)',
            'vague_achievements': r'responsible for|helped with|worked on',
            'buzzwords': r'synergy|rockstar|ninja|guru|thought leader',
        }

    def analyze(self, resume_text: str, resume_metadata: Optional[Dict] = None) -> ResumeXRayAnalysis:
        """
        Comprehensive resume analysis

        Args:
            resume_text: Raw resume text
            resume_metadata: Optional metadata (filename, source, etc.)

        Returns:
            ResumeXRayAnalysis object with all insights
        """
        print("🔍 Starting Resume X-Ray Analysis...")

        # Extract basic information
        contact_info = self._extract_contact_info(resume_text)

        # Parse career history
        positions = self._parse_career_history(resume_text)

        # Advanced analyses
        hidden_skills = self._detect_hidden_skills(resume_text, positions)
        trajectory = self._analyze_career_trajectory(positions)
        stability = self._calculate_stability_score(positions)
        authenticity = self._verify_authenticity(resume_text, positions)
        cultural_markers = self._extract_cultural_markers(resume_text)
        red_flags = self._identify_red_flags(resume_text, positions)
        competitive_intel = self._gather_competitive_intelligence(positions)

        # Calculate scores
        quality_score = self._calculate_quality_score(
            hidden_skills, trajectory, stability, authenticity
        )
        experience_level = self._determine_experience_level(positions)
        technical_depth = self._assess_technical_depth(hidden_skills)
        leadership_score = self._assess_leadership(positions, resume_text)

        # Calculate confidence
        confidence = self._calculate_confidence(resume_text, positions)

        analysis = ResumeXRayAnalysis(
            candidate_name=contact_info.get('name', 'Unknown'),
            email=contact_info.get('email', ''),
            phone=contact_info.get('phone', ''),
            linkedin=contact_info.get('linkedin'),
            hidden_skills=hidden_skills,
            career_trajectory=trajectory,
            stability_score=stability,
            authenticity_check=authenticity,
            cultural_markers=cultural_markers,
            red_flags=red_flags,
            competitive_intel=competitive_intel,
            overall_quality_score=quality_score,
            experience_level=experience_level,
            technical_depth_score=technical_depth,
            leadership_score=leadership_score,
            analyzed_at=datetime.now(),
            confidence_score=confidence
        )

        print(f"✅ Analysis complete! Quality Score: {quality_score:.1f}/100")
        return analysis

    def _extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information"""
        info = {}

        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            info['email'] = emails[0]

        # Phone
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
            info['phone'] = ''.join(phones[0]) if isinstance(phones[0], tuple) else phones[0]

        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin:
            info['linkedin'] = linkedin.group(0)

        # Name (first line or using NLP)
        lines = text.strip().split('\n')
        if lines:
            potential_name = lines[0].strip()
            if len(potential_name.split()) <= 4 and not any(c.isdigit() for c in potential_name):
                info['name'] = potential_name

        return info

    def _parse_career_history(self, text: str) -> List[CareerPosition]:
        """Parse career history using AI"""

        prompt = f"""Analyze this resume and extract the career history in JSON format.

Resume:
{text[:4000]}

Return a JSON array of positions with this structure:
{{
  "positions": [
    {{
      "title": "Job Title",
      "company": "Company Name",
      "start_date": "2020-01",
      "end_date": "2022-06" or "Present",
      "responsibilities": ["List", "of", "responsibilities"],
      "achievements": ["Quantified", "achievements"],
      "skills_used": ["Skills", "used"]
    }}
  ]
}}

Only return valid JSON, no other text."""

        response = self.claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        try:
            content = response.content[0].text
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group(0))
                positions = []

                for pos in data.get('positions', []):
                    # Parse dates
                    start_date = self._parse_date(pos.get('start_date', ''))
                    end_date = self._parse_date(pos.get('end_date', '')) if pos.get('end_date') != 'Present' else None

                    # Calculate duration
                    if start_date:
                        end = end_date or datetime.now()
                        duration = (end.year - start_date.year) * 12 + (end.month - start_date.month)
                    else:
                        duration = 0

                    # Determine level
                    level = self._determine_position_level(pos.get('title', ''))

                    positions.append(CareerPosition(
                        title=pos.get('title', ''),
                        company=pos.get('company', ''),
                        start_date=start_date or datetime.now(),
                        end_date=end_date,
                        duration_months=duration,
                        responsibilities=pos.get('responsibilities', []),
                        achievements=pos.get('achievements', []),
                        skills_used=pos.get('skills_used', []),
                        level=level
                    ))

                return positions
        except Exception as e:
            print(f"Warning: Could not parse career history - {e}")

        return []

    def _detect_hidden_skills(self, text: str, positions: List[CareerPosition]) -> List[Dict[str, Any]]:
        """Detect implicit skills from context"""

        hidden_skills = []
        doc = nlp(text.lower())

        # Skill categories with implicit indicators
        skill_indicators = {
            'leadership': ['led', 'managed', 'mentored', 'grew team', 'hired', 'built team'],
            'project_management': ['delivered', 'coordinated', 'planned', 'executed', 'sprint'],
            'communication': ['presented', 'stakeholder', 'documentation', 'wrote', 'published'],
            'problem_solving': ['improved', 'optimized', 'solved', 'reduced', 'increased'],
            'data_analysis': ['analyzed', 'insights', 'metrics', 'kpi', 'dashboard'],
            'scalability': ['scaled', 'growth', 'millions of users', 'high traffic'],
            'devops': ['deployed', 'ci/cd', 'automated', 'infrastructure', 'monitoring'],
            'security': ['secure', 'authentication', 'encryption', 'compliance', 'gdpr'],
        }

        for skill_category, indicators in skill_indicators.items():
            matches = []
            confidence = 0

            for indicator in indicators:
                if indicator in text.lower():
                    matches.append(indicator)
                    confidence += 1

            if matches:
                # Use AI to verify and quantify the skill
                verification = self._verify_implicit_skill(text, skill_category, matches)

                hidden_skills.append({
                    'skill': skill_category,
                    'confidence': min(confidence / len(indicators) * 100, 100),
                    'evidence': matches[:3],
                    'proficiency_level': verification.get('level', 'intermediate'),
                    'years_experience': verification.get('years', 0)
                })

        # Use Claude to find additional hidden skills
        ai_skills = self._ai_detect_hidden_skills(text)
        hidden_skills.extend(ai_skills)

        # Sort by confidence
        hidden_skills.sort(key=lambda x: x['confidence'], reverse=True)

        return hidden_skills[:15]  # Top 15 hidden skills

    def _verify_implicit_skill(self, text: str, skill: str, evidence: List[str]) -> Dict:
        """Verify and quantify an implicit skill using AI"""

        prompt = f"""Based on this resume excerpt and evidence, assess the candidate's {skill} skill.

Evidence: {', '.join(evidence)}

Resume excerpt:
{text[:1000]}

Return JSON:
{{
  "level": "beginner|intermediate|advanced|expert",
  "years": estimated_years_of_experience,
  "confidence": 0-100
}}"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=200,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except:
            pass

        return {'level': 'intermediate', 'years': 2, 'confidence': 50}

    def _ai_detect_hidden_skills(self, text: str) -> List[Dict]:
        """Use AI to detect additional hidden skills"""

        prompt = f"""Analyze this resume and identify implicit/hidden skills not explicitly listed.

Look for:
- Skills implied by accomplishments
- Technical skills used but not listed
- Soft skills demonstrated through examples
- Domain expertise shown through context

Resume:
{text[:2000]}

Return JSON array:
[
  {{
    "skill": "skill name",
    "confidence": 0-100,
    "evidence": ["evidence 1", "evidence 2"],
    "proficiency_level": "beginner|intermediate|advanced|expert",
    "years_experience": number
  }}
]"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except:
            pass

        return []

    def _analyze_career_trajectory(self, positions: List[CareerPosition]) -> Dict[str, Any]:
        """Analyze career progression and trajectory"""

        if not positions:
            return {'trend': 'insufficient_data', 'progression_score': 0}

        # Sort positions by start date
        sorted_positions = sorted(positions, key=lambda p: p.start_date)

        # Analyze progression
        level_order = ['junior', 'mid', 'senior', 'lead', 'executive']
        levels = [level_order.index(p.level) for p in sorted_positions]

        # Calculate trend
        if len(levels) > 1:
            trend = np.polyfit(range(len(levels)), levels, 1)[0]

            if trend > 0.3:
                trend_direction = 'upward'
            elif trend < -0.3:
                trend_direction = 'downward'
            else:
                trend_direction = 'lateral'
        else:
            trend_direction = 'single_position'
            trend = 0

        # Calculate progression score (0-100)
        progression_score = min((trend + 1) * 50, 100)

        # Identify career pivots
        pivots = []
        for i in range(1, len(sorted_positions)):
            prev_skills = set(sorted_positions[i-1].skills_used)
            curr_skills = set(sorted_positions[i].skills_used)

            overlap = len(prev_skills & curr_skills) / max(len(prev_skills), 1)

            if overlap < 0.3:
                pivots.append({
                    'from': sorted_positions[i-1].title,
                    'to': sorted_positions[i].title,
                    'year': sorted_positions[i].start_date.year,
                    'skill_overlap': f"{overlap*100:.0f}%"
                })

        # Calculate velocity (promotions per year)
        if len(positions) > 1:
            total_months = sum(p.duration_months for p in positions)
            promotions = sum(1 for i in range(1, len(levels)) if levels[i] > levels[i-1])
            velocity = (promotions / (total_months / 12)) if total_months > 0 else 0
        else:
            velocity = 0

        return {
            'trend': trend_direction,
            'progression_score': progression_score,
            'career_velocity': f"{velocity:.2f} promotions/year",
            'pivots': pivots,
            'consistency': self._calculate_consistency(positions),
            'current_level': sorted_positions[-1].level if sorted_positions else 'unknown',
            'years_of_experience': sum(p.duration_months for p in positions) / 12,
            'average_tenure': np.mean([p.duration_months for p in positions]) / 12 if positions else 0
        }

    def _calculate_stability_score(self, positions: List[CareerPosition]) -> float:
        """Calculate job stability score (0-100)"""

        if not positions:
            return 50.0  # Neutral score

        factors = {
            'tenure_score': 0,
            'gap_penalty': 0,
            'frequency_score': 0,
            'recent_stability': 0
        }

        # Average tenure (ideal: 2-4 years)
        avg_tenure_years = np.mean([p.duration_months for p in positions]) / 12
        if 2 <= avg_tenure_years <= 4:
            factors['tenure_score'] = 30
        elif 1 <= avg_tenure_years < 2:
            factors['tenure_score'] = 20
        elif avg_tenure_years < 1:
            factors['tenure_score'] = 5
        else:
            factors['tenure_score'] = 25

        # Check for gaps
        sorted_positions = sorted(positions, key=lambda p: p.start_date)
        gaps = []
        for i in range(1, len(sorted_positions)):
            prev_end = sorted_positions[i-1].end_date or datetime.now()
            curr_start = sorted_positions[i].start_date
            gap_months = (curr_start.year - prev_end.year) * 12 + (curr_start.month - prev_end.month)

            if gap_months > 2:
                gaps.append(gap_months)

        # Penalize for gaps
        total_gap_months = sum(gaps)
        factors['gap_penalty'] = max(0, 20 - (total_gap_months / 6))

        # Job frequency (penalize job hopping)
        if len(positions) > 5:
            years_span = (datetime.now().year - sorted_positions[0].start_date.year)
            jobs_per_year = len(positions) / max(years_span, 1)

            if jobs_per_year > 1:
                factors['frequency_score'] = 5
            elif jobs_per_year > 0.5:
                factors['frequency_score'] = 15
            else:
                factors['frequency_score'] = 25
        else:
            factors['frequency_score'] = 25

        # Recent stability (last 3 years)
        recent_positions = [p for p in positions if (datetime.now() - p.start_date).days < 1095]
        if recent_positions:
            recent_avg = np.mean([p.duration_months for p in recent_positions]) / 12
            if recent_avg > 2:
                factors['recent_stability'] = 25
            elif recent_avg > 1:
                factors['recent_stability'] = 15
            else:
                factors['recent_stability'] = 5

        total_score = sum(factors.values())
        return min(total_score, 100)

    def _verify_authenticity(self, text: str, positions: List[CareerPosition]) -> Dict[str, Any]:
        """Verify resume authenticity and detect potential fabrications"""

        flags = []
        confidence = 100.0

        # Check for inconsistencies in dates
        for pos in positions:
            if pos.end_date and pos.end_date < pos.start_date:
                flags.append({
                    'type': 'date_inconsistency',
                    'severity': 'high',
                    'details': f'{pos.title} at {pos.company}: End date before start date'
                })
                confidence -= 20

        # Check for impossible timelines
        overlapping = self._detect_overlapping_positions(positions)
        if overlapping:
            flags.extend(overlapping)
            confidence -= 10 * len(overlapping)

        # Check for vague or unverifiable claims
        vague_patterns = [
            r'top\s+\d+%', r'best in class', r'world.?class',
            r'responsible for \$\d+[mb]', r'increased by \d+%'
        ]

        vague_count = sum(len(re.findall(pattern, text, re.IGNORECASE)) for pattern in vague_patterns)
        if vague_count > 5:
            flags.append({
                'type': 'excessive_vague_claims',
                'severity': 'medium',
                'details': f'Found {vague_count} potentially unverifiable claims'
            })
            confidence -= 5

        # Check for technology timeline accuracy (e.g., claimed to use tech before it existed)
        tech_timeline_issues = self._verify_technology_timeline(positions)
        if tech_timeline_issues:
            flags.extend(tech_timeline_issues)
            confidence -= 15

        # AI-based authenticity check
        ai_verification = self._ai_verify_authenticity(text)
        flags.extend(ai_verification.get('flags', []))
        confidence = min(confidence, ai_verification.get('confidence', 100))

        return {
            'is_authentic': confidence > 70,
            'confidence': max(confidence, 0),
            'flags': flags,
            'verification_needed': len([f for f in flags if f['severity'] == 'high']) > 0
        }

    def _detect_overlapping_positions(self, positions: List[CareerPosition]) -> List[Dict]:
        """Detect overlapping employment periods"""

        overlaps = []
        sorted_positions = sorted(positions, key=lambda p: p.start_date)

        for i in range(len(sorted_positions) - 1):
            for j in range(i + 1, len(sorted_positions)):
                pos1 = sorted_positions[i]
                pos2 = sorted_positions[j]

                pos1_end = pos1.end_date or datetime.now()

                # Check if they overlap
                if pos1.start_date <= pos2.start_date <= pos1_end:
                    overlap_months = (pos1_end.year - pos2.start_date.year) * 12 + \
                                   (pos1_end.month - pos2.start_date.month)

                    if overlap_months > 1:  # More than 1 month overlap
                        overlaps.append({
                            'type': 'overlapping_positions',
                            'severity': 'medium',
                            'details': f'{pos1.title} and {pos2.title} overlap by {overlap_months} months'
                        })

        return overlaps

    def _verify_technology_timeline(self, positions: List[CareerPosition]) -> List[Dict]:
        """Verify that technologies were used after they were available"""

        # Technology release dates (sample - extend as needed)
        tech_releases = {
            'react': datetime(2013, 5, 1),
            'vue': datetime(2014, 2, 1),
            'kubernetes': datetime(2014, 6, 1),
            'docker': datetime(2013, 3, 1),
            'tensorflow': datetime(2015, 11, 1),
            'chatgpt': datetime(2022, 11, 1),
            'next.js': datetime(2016, 10, 1),
        }

        issues = []
        for pos in positions:
            for skill in pos.skills_used:
                skill_lower = skill.lower().replace('.', '').replace(' ', '')

                for tech, release_date in tech_releases.items():
                    if tech in skill_lower:
                        if pos.start_date < release_date:
                            issues.append({
                                'type': 'technology_timeline_error',
                                'severity': 'high',
                                'details': f'Claimed to use {skill} in {pos.start_date.year}, but it was released in {release_date.year}'
                            })

        return issues

    def _ai_verify_authenticity(self, text: str) -> Dict:
        """Use AI to verify resume authenticity"""

        prompt = f"""Analyze this resume for authenticity. Look for:
- Inconsistencies in claims
- Exaggerated achievements
- Red flags or suspicious patterns
- Timeline issues

Resume:
{text[:2000]}

Return JSON:
{{
  "confidence": 0-100,
  "flags": [
    {{"type": "flag_type", "severity": "low|medium|high", "details": "description"}}
  ],
  "reasoning": "brief explanation"
}}"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except:
            pass

        return {'confidence': 85, 'flags': []}

    def _extract_cultural_markers(self, text: str) -> List[Dict[str, str]]:
        """Extract cultural values and work style indicators"""

        cultural_indicators = {
            'collaboration': ['team', 'collaborated', 'cross-functional', 'partnership'],
            'innovation': ['innovative', 'pioneered', 'created', 'invented', 'first'],
            'data_driven': ['data', 'metrics', 'analysis', 'kpi', 'measured'],
            'customer_focus': ['customer', 'user', 'client', 'stakeholder'],
            'ownership': ['owned', 'led', 'drove', 'initiated', 'founded'],
            'continuous_learning': ['learned', 'certified', 'training', 'courses', 'upskilled'],
            'remote_work': ['remote', 'distributed', 'async', 'virtual'],
            'startup_experience': ['startup', '0-1', 'early stage', 'seed', 'series a'],
            'enterprise': ['enterprise', 'fortune 500', 'large scale', 'global'],
            'agile': ['agile', 'scrum', 'sprint', 'kanban', 'iterative']
        }

        markers = []
        text_lower = text.lower()

        for culture, keywords in cultural_indicators.items():
            matches = sum(1 for kw in keywords if kw in text_lower)

            if matches > 0:
                strength = 'strong' if matches >= 3 else 'moderate' if matches >= 2 else 'weak'
                markers.append({
                    'marker': culture,
                    'strength': strength,
                    'frequency': matches
                })

        # Sort by frequency
        markers.sort(key=lambda x: x['frequency'], reverse=True)

        return markers

    def _identify_red_flags(self, text: str, positions: List[CareerPosition]) -> List[Dict[str, str]]:
        """Identify potential red flags"""

        red_flags = []

        # Job hopping (>3 jobs in 3 years)
        recent_jobs = [p for p in positions if (datetime.now() - p.start_date).days < 1095]
        if len(recent_jobs) > 3:
            red_flags.append({
                'flag': 'job_hopping',
                'severity': 'medium',
                'details': f'{len(recent_jobs)} jobs in last 3 years'
            })

        # Short tenures (<6 months)
        short_tenures = [p for p in positions if p.duration_months < 6]
        if len(short_tenures) > 2:
            red_flags.append({
                'flag': 'multiple_short_tenures',
                'severity': 'medium',
                'details': f'{len(short_tenures)} positions under 6 months'
            })

        # Employment gaps
        sorted_positions = sorted(positions, key=lambda p: p.start_date)
        for i in range(1, len(sorted_positions)):
            prev_end = sorted_positions[i-1].end_date or datetime.now()
            curr_start = sorted_positions[i].start_date
            gap_months = (curr_start.year - prev_end.year) * 12 + (curr_start.month - prev_end.month)

            if gap_months > 6:
                red_flags.append({
                    'flag': 'employment_gap',
                    'severity': 'low',
                    'details': f'{gap_months} month gap between {sorted_positions[i-1].company} and {sorted_positions[i].company}'
                })

        # Excessive buzzwords
        buzzwords = ['synergy', 'rockstar', 'ninja', 'guru', 'thought leader', 'disruptive']
        buzzword_count = sum(text.lower().count(word) for word in buzzwords)
        if buzzword_count > 3:
            red_flags.append({
                'flag': 'excessive_buzzwords',
                'severity': 'low',
                'details': f'Found {buzzword_count} buzzwords'
            })

        # Vague achievements
        vague_phrases = ['responsible for', 'helped with', 'worked on', 'contributed to']
        vague_count = sum(text.lower().count(phrase) for phrase in vague_phrases)
        if vague_count > 5:
            red_flags.append({
                'flag': 'vague_achievements',
                'severity': 'medium',
                'details': f'Many achievements lack specificity ({vague_count} vague phrases)'
            })

        return red_flags

    def _gather_competitive_intelligence(self, positions: List[CareerPosition]) -> Dict[str, Any]:
        """Extract competitive intelligence from work history"""

        companies = [p.company for p in positions]

        # Identify competitor experience
        tech_giants = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix']
        competitor_exp = [c for c in companies if any(giant in c.lower() for giant in tech_giants)]

        # Industry diversity
        industries = set()
        for pos in positions:
            # Simple industry classification (enhance with real data)
            if any(word in pos.company.lower() for word in ['bank', 'financial', 'capital']):
                industries.add('finance')
            elif any(word in pos.company.lower() for word in ['health', 'medical', 'pharma']):
                industries.add('healthcare')
            elif any(word in pos.company.lower() for word in ['tech', 'software', 'systems']):
                industries.add('technology')

        # Extract unique technologies/skills
        all_skills = set()
        for pos in positions:
            all_skills.update(pos.skills_used)

        return {
            'competitor_experience': competitor_exp,
            'faang_experience': len(competitor_exp) > 0,
            'industry_diversity': list(industries),
            'unique_skills': list(all_skills),
            'total_companies': len(set(companies)),
            'company_types': self._classify_company_types(companies)
        }

    def _classify_company_types(self, companies: List[str]) -> Dict[str, int]:
        """Classify companies by type"""

        types = defaultdict(int)

        for company in companies:
            company_lower = company.lower()

            if any(word in company_lower for word in ['startup', 'labs', 'ventures']):
                types['startup'] += 1
            elif any(word in company_lower for word in ['corporation', 'inc', 'corp', 'ltd']):
                types['corporate'] += 1
            elif any(word in company_lower for word in ['consulting', 'advisory', 'partners']):
                types['consulting'] += 1
            elif any(word in company_lower for word in ['agency', 'studio', 'creative']):
                types['agency'] += 1
            else:
                types['other'] += 1

        return dict(types)

    def _calculate_quality_score(self, hidden_skills, trajectory, stability, authenticity) -> float:
        """Calculate overall resume quality score"""

        # Weight different factors
        weights = {
            'skills': 0.25,
            'trajectory': 0.25,
            'stability': 0.20,
            'authenticity': 0.30
        }

        scores = {
            'skills': min(len(hidden_skills) * 5, 100),
            'trajectory': trajectory.get('progression_score', 50),
            'stability': stability,
            'authenticity': authenticity.get('confidence', 50)
        }

        total = sum(scores[k] * weights[k] for k in weights)

        return min(total, 100)

    def _determine_experience_level(self, positions: List[CareerPosition]) -> str:
        """Determine overall experience level"""

        if not positions:
            return 'entry'

        total_years = sum(p.duration_months for p in positions) / 12
        latest_level = sorted(positions, key=lambda p: p.start_date)[-1].level

        if total_years < 2:
            return 'entry'
        elif total_years < 5:
            return 'mid-level'
        elif total_years < 10:
            return 'senior'
        elif latest_level in ['lead', 'executive']:
            return 'executive'
        else:
            return 'senior'

    def _assess_technical_depth(self, hidden_skills: List[Dict]) -> float:
        """Assess technical skill depth (0-100)"""

        if not hidden_skills:
            return 50.0

        # Weight by confidence and proficiency
        total_score = 0
        proficiency_weights = {
            'beginner': 0.25,
            'intermediate': 0.5,
            'advanced': 0.75,
            'expert': 1.0
        }

        for skill in hidden_skills:
            confidence = skill.get('confidence', 50) / 100
            proficiency = proficiency_weights.get(skill.get('proficiency_level', 'intermediate'), 0.5)
            total_score += confidence * proficiency * 100

        return min(total_score / len(hidden_skills), 100)

    def _assess_leadership(self, positions: List[CareerPosition], text: str) -> float:
        """Assess leadership capability (0-100)"""

        leadership_indicators = [
            'led', 'managed', 'mentored', 'coached', 'hired', 'built team',
            'director', 'vp', 'head of', 'chief', 'lead', 'principal'
        ]

        text_lower = text.lower()
        indicator_count = sum(1 for ind in leadership_indicators if ind in text_lower)

        # Check for leadership positions
        leadership_positions = sum(1 for p in positions if p.level in ['lead', 'executive'])

        score = min((indicator_count * 10) + (leadership_positions * 20), 100)

        return score

    def _calculate_confidence(self, text: str, positions: List[CareerPosition]) -> float:
        """Calculate confidence in the analysis"""

        confidence = 100.0

        # Penalize for insufficient data
        if len(text) < 500:
            confidence -= 30
        elif len(text) < 1000:
            confidence -= 15

        if len(positions) < 2:
            confidence -= 20

        # Penalize for missing contact info
        if '@' not in text:
            confidence -= 10

        return max(confidence, 0)

    def _calculate_consistency(self, positions: List[CareerPosition]) -> str:
        """Calculate career consistency"""

        if len(positions) < 2:
            return 'insufficient_data'

        # Analyze skill overlap between positions
        overlaps = []
        for i in range(len(positions) - 1):
            skills1 = set(positions[i].skills_used)
            skills2 = set(positions[i + 1].skills_used)

            if skills1 and skills2:
                overlap = len(skills1 & skills2) / len(skills1 | skills2)
                overlaps.append(overlap)

        if overlaps:
            avg_overlap = np.mean(overlaps)

            if avg_overlap > 0.7:
                return 'very_consistent'
            elif avg_overlap > 0.5:
                return 'consistent'
            elif avg_overlap > 0.3:
                return 'some_pivots'
            else:
                return 'multiple_pivots'

        return 'unknown'

    def _determine_position_level(self, title: str) -> str:
        """Determine seniority level from job title"""

        title_lower = title.lower()

        if any(word in title_lower for word in ['cto', 'ceo', 'vp', 'chief', 'director', 'head of']):
            return 'executive'
        elif any(word in title_lower for word in ['lead', 'principal', 'staff', 'architect']):
            return 'lead'
        elif any(word in title_lower for word in ['senior', 'sr.', 'sr ']):
            return 'senior'
        elif any(word in title_lower for word in ['junior', 'jr.', 'jr ', 'intern', 'associate']):
            return 'junior'
        else:
            return 'mid'

    def _parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse various date formats"""

        if not date_str or date_str.lower() in ['present', 'current', 'now']:
            return None

        # Try various formats
        formats = [
            '%Y-%m',
            '%Y/%m',
            '%m/%Y',
            '%B %Y',
            '%b %Y',
            '%Y'
        ]

        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except:
                continue

        return None

    def _load_skill_taxonomy(self) -> Dict:
        """Load skill taxonomy for categorization"""

        # Simplified taxonomy - expand as needed
        return {
            'programming_languages': ['python', 'java', 'javascript', 'typescript', 'go', 'rust', 'c++'],
            'frameworks': ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express'],
            'databases': ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch'],
            'cloud': ['aws', 'azure', 'gcp', 'kubernetes', 'docker'],
            'methodologies': ['agile', 'scrum', 'tdd', 'ci/cd', 'devops']
        }

    def export_to_json(self, analysis: ResumeXRayAnalysis) -> str:
        """Export analysis to JSON"""

        data = asdict(analysis)
        # Convert datetime objects to strings
        data['analyzed_at'] = data['analyzed_at'].isoformat()

        return json.dumps(data, indent=2)

    def generate_summary(self, analysis: ResumeXRayAnalysis) -> str:
        """Generate human-readable summary"""

        summary = f"""
Resume X-Ray Analysis Summary
{'=' * 50}

Candidate: {analysis.candidate_name}
Overall Quality Score: {analysis.overall_quality_score:.1f}/100
Experience Level: {analysis.experience_level}
Confidence: {analysis.confidence_score:.1f}%

CAREER TRAJECTORY: {analysis.career_trajectory['trend'].upper()}
- Progression Score: {analysis.career_trajectory['progression_score']:.1f}/100
- Career Velocity: {analysis.career_trajectory['career_velocity']}
- Years of Experience: {analysis.career_trajectory['years_of_experience']:.1f}

STABILITY SCORE: {analysis.stability_score:.1f}/100

HIDDEN SKILLS DETECTED: {len(analysis.hidden_skills)}
Top Skills:
"""

        for skill in analysis.hidden_skills[:5]:
            summary += f"  • {skill['skill']}: {skill['proficiency_level']} ({skill['confidence']:.0f}% confidence)\n"

        if analysis.red_flags:
            summary += f"\nRED FLAGS: {len(analysis.red_flags)}\n"
            for flag in analysis.red_flags[:3]:
                summary += f"  ⚠️  {flag['flag']}: {flag['details']}\n"

        summary += f"\nAUTHENTICITY: {'✓ Verified' if analysis.authenticity_check['is_authentic'] else '⚠️ Requires Review'}\n"
        summary += f"Confidence: {analysis.authenticity_check['confidence']:.1f}%\n"

        summary += f"\nCOMPETITIVE INTELLIGENCE:\n"
        summary += f"  • FAANG Experience: {'Yes' if analysis.competitive_intel.get('faang_experience') else 'No'}\n"
        summary += f"  • Industries: {', '.join(analysis.competitive_intel.get('industry_diversity', []))}\n"

        return summary


# Example usage
if __name__ == "__main__":
    import os

    # Initialize
    xray = ResumeXRayVision(
        anthropic_key=os.getenv('ANTHROPIC_API_KEY', ''),
        openai_key=os.getenv('OPENAI_API_KEY', '')
    )

    # Sample resume
    sample_resume = """
John Smith
john.smith@email.com | (555) 123-4567 | linkedin.com/in/johnsmith

EXPERIENCE

Senior Software Engineer | TechCorp Inc | 2020-01 - Present
• Led team of 5 engineers building scalable microservices platform
• Improved system performance by 40% through optimization
• Mentored junior developers and conducted code reviews
• Technologies: Python, React, AWS, Kubernetes

Software Engineer | StartupXYZ | 2018-03 - 2019-12
• Built RESTful APIs serving 1M+ requests/day
• Implemented CI/CD pipeline reducing deployment time by 60%
• Collaborated with cross-functional teams on product features
• Technologies: Node.js, MongoDB, Docker

Junior Developer | SmallCo | 2016-06 - 2018-02
• Developed features for customer-facing web application
• Fixed bugs and improved code quality
• Participated in agile sprint planning
• Technologies: JavaScript, HTML, CSS

EDUCATION
BS Computer Science | State University | 2012-2016
"""

    # Analyze
    result = xray.analyze(sample_resume)

    # Print summary
    print(xray.generate_summary(result))

    # Export to JSON
    with open('resume_analysis.json', 'w') as f:
        f.write(xray.export_to_json(result))

    print("\n✅ Analysis exported to resume_analysis.json")

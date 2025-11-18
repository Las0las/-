"""
Diversity & Inclusion Optimizer Skill
Bias detection and inclusive hiring practices

Features:
- Blind resume mode
- Bias detection in job postings
- Diverse slate enforcement
- Inclusive language suggestions
- Accessibility compliance checking
- Equal opportunity tracking
- DEIB metrics and reporting
"""

import re
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass, asdict
import anthropic
from openai import OpenAI
import spacy
from collections import defaultdict


# Load NLP
try:
    nlp = spacy.load("en_core_web_lg")
except:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_lg"])
    nlp = spacy.load("en_core_web_lg")


@dataclass
class BiasDetectionResult:
    """Bias detection results"""
    text: str
    bias_score: float  # 0-100, higher = more bias
    biases_found: List[Dict[str, Any]]
    inclusive_alternatives: List[str]
    overall_assessment: str
    recommendations: List[str]


@dataclass
class DEIBMetrics:
    """Diversity, Equity, Inclusion & Belonging metrics"""
    total_candidates: int
    demographic_breakdown: Dict[str, Dict[str, int]]
    pipeline_diversity: Dict[str, Dict[str, float]]
    hiring_diversity: Dict[str, Dict[str, int]]
    retention_by_group: Dict[str, float]
    pay_equity_score: float
    inclusion_score: float
    compliance_status: str


class InclusionOptimizer:
    """Diversity & Inclusion optimization engine"""

    def __init__(self, anthropic_key: str, openai_key: str):
        self.claude = anthropic.Anthropic(api_key=anthropic_key)
        self.openai = OpenAI(api_key=openai_key)

        # Bias patterns and indicators
        self.bias_indicators = {
            'gender_bias': {
                'patterns': [
                    r'\b(he|him|his)\b', r'\b(she|her|hers)\b',
                    r'\brock[\s-]?star\b', r'\bninja\b', r'\bguru\b',
                    r'\bdominant\b', r'\baggressive\b',
                    r'\bnurturing\b', r'\bsupportive\b'
                ],
                'severity': 'high'
            },
            'age_bias': {
                'patterns': [
                    r'\byoung\b', r'\benergetic\b', r'\bdigital native\b',
                    r'\brecent grad\b', r'\bnew grad\b',
                    r'\bexperienced\b.*\bonly\b', r'\b\d+\+\s*years'
                ],
                'severity': 'high'
            },
            'cultural_bias': {
                'patterns': [
                    r'\bnative speaker\b', r'\bculture fit\b',
                    r'\btraditional values\b', r'\bamerican\b.*\brequired\b'
                ],
                'severity': 'high'
            },
            'socioeconomic_bias': {
                'patterns': [
                    r'\btop[\s-]?tier university\b', r'\bivy league\b',
                    r'\bprestigious\b', r'\belite\b'
                ],
                'severity': 'medium'
            },
            'ability_bias': {
                'patterns': [
                    r'\bphysically fit\b', r'\bable[\s-]?bodied\b',
                    r'\bperfect vision\b'
                ],
                'severity': 'high'
            }
        }

        # Inclusive language alternatives
        self.inclusive_alternatives = {
            'guys': 'team / everyone / folks',
            'manpower': 'workforce / staff / personnel',
            'chairman': 'chairperson / chair',
            'salesman': 'salesperson / sales representative',
            'culture fit': 'values alignment / team contribution',
            'native speaker': 'fluent / proficient',
            'young and energetic': 'dynamic / motivated',
            'recent grad': 'early career professional',
            'rockstar': 'high performer / expert',
            'ninja': 'expert / specialist'
        }

    def analyze_job_posting(self, job_description: str) -> BiasDetectionResult:
        """Analyze job posting for bias"""

        print("🔍 Analyzing job posting for bias...")

        biases_found = []
        bias_score = 0

        # Check for bias patterns
        text_lower = job_description.lower()

        for bias_type, config in self.bias_indicators.items():
            for pattern in config['patterns']:
                matches = re.findall(pattern, text_lower, re.IGNORECASE)

                if matches:
                    severity_weights = {'low': 5, 'medium': 10, 'high': 15}
                    bias_score += len(matches) * severity_weights[config['severity']]

                    biases_found.append({
                        'type': bias_type,
                        'severity': config['severity'],
                        'matches': list(set(matches)),
                        'count': len(matches)
                    })

        # AI-powered bias detection
        ai_biases = self._ai_detect_bias(job_description)
        biases_found.extend(ai_biases)
        bias_score += len(ai_biases) * 10

        # Generate inclusive alternatives
        alternatives = self._generate_alternatives(job_description, biases_found)

        # Overall assessment
        if bias_score < 20:
            assessment = 'excellent_inclusive'
        elif bias_score < 40:
            assessment = 'good_minor_issues'
        elif bias_score < 70:
            assessment = 'needs_improvement'
        else:
            assessment = 'significant_bias_detected'

        # Generate recommendations
        recommendations = self._generate_recommendations(biases_found, bias_score)

        result = BiasDetectionResult(
            text=job_description,
            bias_score=min(bias_score, 100),
            biases_found=biases_found,
            inclusive_alternatives=alternatives,
            overall_assessment=assessment,
            recommendations=recommendations
        )

        print(f"✅ Analysis complete! Bias score: {result.bias_score}/100")
        return result

    def _ai_detect_bias(self, text: str) -> List[Dict]:
        """Use AI to detect subtle bias"""

        prompt = f"""Analyze this job posting for subtle bias, including:
- Gender-coded language
- Age bias (implied or explicit)
- Cultural assumptions
- Socioeconomic bias
- Ability/disability bias
- Racial or ethnic bias
- LGBTQ+ bias

Job Posting:
{text}

Return JSON array:
[
  {{
    "type": "bias_type",
    "severity": "low|medium|high",
    "explanation": "why this is biased",
    "examples": ["specific phrase 1", "specific phrase 2"]
  }}
]

Only return JSON, no other text."""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except:
            pass

        return []

    def _generate_alternatives(self, text: str, biases: List[Dict]) -> List[str]:
        """Generate inclusive alternatives"""

        alternatives = []

        # Pattern-based replacements
        for word, alternative in self.inclusive_alternatives.items():
            if word in text.lower():
                alternatives.append(f"Replace '{word}' with '{alternative}'")

        # AI-generated alternatives
        if biases:
            prompt = f"""Rewrite this job posting to be more inclusive while maintaining the core requirements.

Original:
{text}

Issues to address: {[b['type'] for b in biases[:5]]}

Provide 3 key improvements as bullet points."""

            try:
                response = self.claude.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=800,
                    messages=[{"role": "user", "content": prompt}]
                )

                content = response.content[0].text
                # Extract bullet points
                bullets = re.findall(r'[-•]\s*(.+)', content)
                alternatives.extend(bullets[:3])
            except:
                pass

        return alternatives

    def _generate_recommendations(self, biases: List[Dict], score: float) -> List[str]:
        """Generate actionable recommendations"""

        recommendations = []

        # General recommendations based on score
        if score > 60:
            recommendations.append("🚨 Significant bias detected - recommend rewriting this job posting")
        elif score > 40:
            recommendations.append("⚠️ Several bias issues - review and revise before posting")

        # Specific recommendations by bias type
        bias_types = {b['type'] for b in biases}

        if 'gender_bias' in bias_types:
            recommendations.append("👫 Use gender-neutral language (they/them instead of he/she)")
            recommendations.append("✏️ Avoid gendered job titles and descriptors")

        if 'age_bias' in bias_types:
            recommendations.append("📅 Remove age-related requirements and descriptors")
            recommendations.append("🎯 Focus on skills and competencies, not years of experience")

        if 'cultural_bias' in bias_types:
            recommendations.append("🌍 Remove 'culture fit' language - focus on values alignment")
            recommendations.append("🗣️ Don't require 'native speaker' - use 'fluent' or 'proficient'")

        if 'socioeconomic_bias' in bias_types:
            recommendations.append("🎓 Don't require specific universities - focus on skills")
            recommendations.append("💼 Consider diverse educational backgrounds")

        if 'ability_bias' in bias_types:
            recommendations.append("♿ Include accessibility statement")
            recommendations.append("🤝 Focus on essential job functions only")

        # Best practices
        recommendations.extend([
            "✅ Include diversity statement",
            "📊 Use tools like Textio or Gender Decoder to validate",
            "🎯 List 5-7 truly required skills (not wish list)"
        ])

        return recommendations[:10]

    def create_blind_resume(self, resume_text: str) -> Tuple[str, Dict]:
        """Create anonymized resume for blind screening"""

        print("🎭 Creating blind resume...")

        # Remove identifying information
        blind_resume = resume_text

        redactions = {
            'name': [],
            'email': [],
            'phone': [],
            'address': [],
            'linkedin': [],
            'photo': [],
            'age_indicators': [],
            'gender_indicators': []
        }

        # Name (first non-empty line usually)
        lines = resume_text.split('\n')
        if lines:
            potential_name = lines[0].strip()
            if len(potential_name.split()) <= 4:
                blind_resume = blind_resume.replace(potential_name, '[NAME REDACTED]', 1)
                redactions['name'].append(potential_name)

        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, blind_resume)
        for email in emails:
            blind_resume = blind_resume.replace(email, '[EMAIL REDACTED]')
            redactions['email'].append(email)

        # Phone
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, blind_resume)
        for phone in phones:
            phone_str = ''.join(phone) if isinstance(phone, tuple) else phone
            blind_resume = blind_resume.replace(phone_str, '[PHONE REDACTED]')
            redactions['phone'].append(phone_str)

        # Address
        address_patterns = [
            r'\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)',
            r'(?:Apartment|Apt|Suite|Ste)\s+\w+'
        ]
        for pattern in address_patterns:
            addresses = re.findall(pattern, blind_resume, re.IGNORECASE)
            for address in addresses:
                blind_resume = blind_resume.replace(address, '[ADDRESS REDACTED]')
                redactions['address'].append(address)

        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedins = re.findall(linkedin_pattern, blind_resume, re.IGNORECASE)
        for linkedin in linkedins:
            blind_resume = blind_resume.replace(linkedin, '[LINKEDIN REDACTED]')
            redactions['linkedin'].append(linkedin)

        # Age indicators
        age_patterns = [
            r'\b(19|20)\d{2}\b',  # Birth years
            r'\b\d{1,2}\s*years?\s*old\b'
        ]
        for pattern in age_patterns:
            matches = re.findall(pattern, blind_resume)
            for match in matches:
                # Don't redact if part of work experience date
                if 'experience' not in blind_resume[max(0, blind_resume.find(match)-50):blind_resume.find(match)].lower():
                    blind_resume = blind_resume.replace(match, '[AGE REDACTED]')
                    redactions['age_indicators'].append(match)

        # University graduation years (can indicate age)
        grad_pattern = r'(Graduated|Class of|Bachelor.*|Master.*|PhD.*)\s*(19|20)\d{2}'
        grads = re.findall(grad_pattern, blind_resume, re.IGNORECASE)
        for match in grads:
            full_match = ' '.join(match)
            blind_resume = blind_resume.replace(match[1], '[YEAR REDACTED]')
            redactions['age_indicators'].append(match[1])

        print(f"✅ Blind resume created - {sum(len(v) for v in redactions.values())} items redacted")

        return blind_resume, redactions

    def check_diverse_slate(self, candidates: List[Dict]) -> Dict:
        """Check if candidate slate meets diversity requirements"""

        print("📊 Checking diverse slate requirements...")

        total = len(candidates)

        if total == 0:
            return {
                'meets_requirement': False,
                'message': 'No candidates in slate'
            }

        # Count demographics (if available)
        demographics = defaultdict(lambda: defaultdict(int))

        for candidate in candidates:
            for demo_type, value in candidate.get('demographics', {}).items():
                demographics[demo_type][value] += 1

        # Calculate diversity percentages
        diversity_percentages = {}

        for demo_type, counts in demographics.items():
            diversity_percentages[demo_type] = {
                k: (v / total * 100) for k, v in counts.items()
            }

        # Check Rooney Rule (at least 1 diverse candidate for every 3 candidates)
        diverse_count = sum(
            1 for c in candidates
            if c.get('demographics', {}).get('underrepresented', False)
        )

        meets_rooney = diverse_count >= max(1, total // 3)

        result = {
            'total_candidates': total,
            'diverse_candidates': diverse_count,
            'diversity_percentage': (diverse_count / total * 100) if total > 0 else 0,
            'meets_rooney_rule': meets_rooney,
            'meets_requirement': meets_rooney,
            'demographics': dict(diversity_percentages),
            'recommendations': []
        }

        if not meets_rooney:
            result['recommendations'].append(
                f"⚠️ Add at least {max(1, total // 3) - diverse_count} more diverse candidates to meet Rooney Rule"
            )

        return result

    def generate_inclusion_score(self, data: Dict) -> float:
        """Generate overall inclusion score"""

        score = 100.0

        # Deduct for missing diversity data
        if not data.get('demographics'):
            score -= 20

        # Deduct for non-diverse slate
        if not data.get('meets_rooney_rule', True):
            score -= 30

        # Deduct for biased job postings
        if data.get('bias_score', 0) > 50:
            score -= 25

        return max(score, 0)

    def track_deib_metrics(self, pipeline_data: List[Dict]) -> DEIBMetrics:
        """Track comprehensive DEIB metrics"""

        print("📈 Calculating DEIB metrics...")

        total_candidates = len(pipeline_data)

        # Demographic breakdown
        demographic_breakdown = defaultdict(lambda: defaultdict(int))

        for candidate in pipeline_data:
            for demo_type, value in candidate.get('demographics', {}).items():
                demographic_breakdown[demo_type][value] += 1

        # Pipeline diversity (percentage at each stage)
        stages = ['screening', 'phone_screen', 'interview', 'offer', 'hired']
        pipeline_diversity = {}

        for stage in stages:
            stage_candidates = [c for c in pipeline_data if c.get('stage') == stage]
            if stage_candidates:
                stage_demos = defaultdict(lambda: defaultdict(int))

                for c in stage_candidates:
                    for demo_type, value in c.get('demographics', {}).items():
                        stage_demos[demo_type][value] += 1

                pipeline_diversity[stage] = {
                    demo_type: {
                        k: (v / len(stage_candidates) * 100)
                        for k, v in counts.items()
                    }
                    for demo_type, counts in stage_demos.items()
                }

        # Hiring diversity
        hired = [c for c in pipeline_data if c.get('stage') == 'hired']
        hiring_diversity = defaultdict(lambda: defaultdict(int))

        for candidate in hired:
            for demo_type, value in candidate.get('demographics', {}).items():
                hiring_diversity[demo_type][value] += 1

        # Retention (mock data - would pull from real system)
        retention_by_group = {
            'overall': 85.0,
            'underrepresented': 82.0,
            'women': 84.0,
            'men': 86.0
        }

        # Pay equity score (mock - would calculate from real comp data)
        pay_equity_score = 92.0

        # Inclusion score
        inclusion_score = self.generate_inclusion_score({
            'demographics': demographic_breakdown,
            'meets_rooney_rule': True,
            'bias_score': 20
        })

        # Compliance status
        diverse_hiring_rate = (
            len([c for c in hired if c.get('demographics', {}).get('underrepresented')])
            / len(hired) * 100
        ) if hired else 0

        compliance_status = 'compliant' if diverse_hiring_rate >= 30 else 'needs_improvement'

        metrics = DEIBMetrics(
            total_candidates=total_candidates,
            demographic_breakdown=dict(demographic_breakdown),
            pipeline_diversity=pipeline_diversity,
            hiring_diversity=dict(hiring_diversity),
            retention_by_group=retention_by_group,
            pay_equity_score=pay_equity_score,
            inclusion_score=inclusion_score,
            compliance_status=compliance_status
        )

        print("✅ DEIB metrics calculated")
        return metrics

    def generate_deib_report(self, metrics: DEIBMetrics) -> str:
        """Generate DEIB report"""

        report = f"""
Diversity, Equity, Inclusion & Belonging Report
{'=' * 70}

OVERALL METRICS
Total Candidates Processed: {metrics.total_candidates}
Inclusion Score: {metrics.inclusion_score:.1f}/100
Pay Equity Score: {metrics.pay_equity_score:.1f}/100
Compliance Status: {metrics.compliance_status.upper()}

DEMOGRAPHIC BREAKDOWN
"""

        for demo_type, counts in metrics.demographic_breakdown.items():
            report += f"\n{demo_type.replace('_', ' ').title()}:\n"
            for value, count in counts.items():
                pct = (count / metrics.total_candidates * 100) if metrics.total_candidates > 0 else 0
                report += f"  • {value}: {count} ({pct:.1f}%)\n"

        report += f"""
PIPELINE DIVERSITY (% at each stage)
{'=' * 70}
"""

        for stage, demographics in metrics.pipeline_diversity.items():
            report += f"\n{stage.upper()}:\n"
            for demo_type, percentages in demographics.items():
                for value, pct in percentages.items():
                    report += f"  • {demo_type} - {value}: {pct:.1f}%\n"

        report += f"""
RETENTION BY GROUP
{'=' * 70}
"""

        for group, rate in metrics.retention_by_group.items():
            report += f"{group.replace('_', ' ').title()}: {rate:.1f}%\n"

        return report


# Example usage
if __name__ == "__main__":
    import os

    # Initialize
    optimizer = InclusionOptimizer(
        anthropic_key=os.getenv('ANTHROPIC_API_KEY', ''),
        openai_key=os.getenv('OPENAI_API_KEY', '')
    )

    # Analyze job posting
    sample_job_posting = """
We're looking for a rockstar developer who's a cultural fit for our young, energetic team!

Requirements:
- Recent grad from top-tier university
- Native English speaker
- Guys who can work in a fast-paced environment
- Must be able to lift 50 lbs
- 10+ years of experience required
"""

    result = optimizer.analyze_job_posting(sample_job_posting)

    print("\n" + "="*60)
    print(f"Bias Score: {result.bias_score}/100")
    print(f"Assessment: {result.overall_assessment}")
    print("\nBiases Found:")
    for bias in result.biases_found:
        print(f"  • {bias['type']}: {bias['severity']} severity")

    print("\nRecommendations:")
    for rec in result.recommendations:
        print(f"  {rec}")

    # Create blind resume
    sample_resume = """
    John Smith
    john.smith@email.com | (555) 123-4567
    123 Main Street, San Francisco, CA
    linkedin.com/in/johnsmith

    Born: 1995

    Experience...
    """

    blind_resume, redactions = optimizer.create_blind_resume(sample_resume)

    print("\n" + "="*60)
    print("BLIND RESUME:")
    print(blind_resume[:200])
    print(f"\nRedacted {sum(len(v) for v in redactions.values())} items")

    print("\n✅ Diversity & Inclusion analysis complete!")

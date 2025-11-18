"""
Market Intelligence Skill
Real-time market analysis for recruitment intelligence

Features:
- Supply/demand ratio calculation
- Salary trends analysis
- Emerging skills tracking
- Competitor activity monitoring
- Optimal sourcing channel ranking
- Negotiation leverage assessment
"""

import json
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import anthropic
from openai import OpenAI
import numpy as np
from collections import defaultdict
import pandas as pd


@dataclass
class MarketInsight:
    """Market intelligence insight"""
    role: str
    location: str
    supply_demand_ratio: float  # <1 = tight market, >1 = loose market
    salary_trends: Dict[str, Any]
    skill_emergence: List[Dict[str, Any]]
    competitor_activity: Dict[str, Any]
    optimal_sourcing_channels: List[Dict[str, Any]]
    negotiation_leverage: str  # 'candidate', 'employer', 'neutral'
    market_tightness: str  # 'very_tight', 'tight', 'balanced', 'loose'
    recommendations: List[str]
    analyzed_at: datetime
    confidence_score: float


@dataclass
class SalaryTrend:
    """Salary trend data"""
    role: str
    location: str
    percentile_25: int
    percentile_50: int  # Median
    percentile_75: int
    percentile_90: int
    year_over_year_change: float
    trend_direction: str  # 'rising', 'falling', 'stable'
    confidence: float


class MarketIntelligence:
    """Real-time market intelligence engine"""

    def __init__(self, anthropic_key: str, openai_key: str):
        self.claude = anthropic.Anthropic(api_key=anthropic_key)
        self.openai = OpenAI(api_key=openai_key)

        # Data sources (configure with real API keys)
        self.data_sources = {
            'linkedin_talent_insights': None,  # LinkedIn Talent Insights API
            'glassdoor': None,  # Glassdoor API
            'indeed': None,  # Indeed API
            'levels_fyi': None,  # Levels.fyi data
            'h1b_database': None,  # H1B salary database
        }

    def get_insights(self, role: str, location: str, context: Optional[Dict] = None) -> MarketInsight:
        """
        Get comprehensive market insights for a role and location

        Args:
            role: Job title/role
            location: Geographic location
            context: Additional context (industry, company size, etc.)

        Returns:
            MarketInsight object
        """
        print(f"🔍 Analyzing market for {role} in {location}...")

        # Calculate supply/demand
        supply_demand = self._calculate_supply_demand(role, location)

        # Analyze salary trends
        salary_trends = self._analyze_salary_trends(role, location)

        # Track emerging skills
        emerging_skills = self._track_emerging_skills(role, location)

        # Monitor competitor activity
        competitor_activity = self._monitor_competitors(role, location)

        # Rank sourcing channels
        sourcing_channels = self._rank_sourcing_channels(role, location)

        # Assess negotiation leverage
        leverage = self._assess_negotiation_leverage(supply_demand, salary_trends)

        # Determine market tightness
        tightness = self._determine_market_tightness(supply_demand)

        # Generate recommendations
        recommendations = self._generate_recommendations(
            role, location, supply_demand, salary_trends, tightness
        )

        # Calculate confidence
        confidence = self._calculate_confidence()

        insight = MarketInsight(
            role=role,
            location=location,
            supply_demand_ratio=supply_demand,
            salary_trends=salary_trends,
            skill_emergence=emerging_skills,
            competitor_activity=competitor_activity,
            optimal_sourcing_channels=sourcing_channels,
            negotiation_leverage=leverage,
            market_tightness=tightness,
            recommendations=recommendations,
            analyzed_at=datetime.now(),
            confidence_score=confidence
        )

        print(f"✅ Analysis complete! Market is {tightness}")
        return insight

    def _calculate_supply_demand(self, role: str, location: str) -> float:
        """Calculate supply/demand ratio"""

        # In production, query real data sources
        # For now, use AI to estimate based on known patterns

        prompt = f"""Analyze the supply/demand dynamics for {role} in {location}.

Consider:
- Number of job postings vs. available candidates
- Hiring difficulty reported by companies
- Time-to-fill metrics
- Candidate response rates
- Offer acceptance rates

Return JSON:
{{
  "supply_demand_ratio": float (< 1 = tight market, > 1 = loose market),
  "estimated_candidates": number,
  "estimated_openings": number,
  "avg_time_to_fill_days": number,
  "reasoning": "brief explanation"
}}"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group(0))
                return data.get('supply_demand_ratio', 1.0)
        except:
            pass

        # Fallback: return neutral
        return 1.0

    def _analyze_salary_trends(self, role: str, location: str) -> Dict[str, Any]:
        """Analyze salary trends"""

        # In production, query salary databases
        # For demo, use AI estimation

        prompt = f"""Provide salary data for {role} in {location}.

Return JSON with realistic salary ranges:
{{
  "currency": "USD",
  "percentile_25": number,
  "percentile_50": number,
  "percentile_75": number,
  "percentile_90": number,
  "year_over_year_change": percent_as_decimal,
  "trend_direction": "rising|stable|falling",
  "factors_driving_trend": ["factor1", "factor2"],
  "market_rate_range": "human readable range"
}}"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=600,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except:
            pass

        # Fallback default
        return {
            "currency": "USD",
            "percentile_25": 80000,
            "percentile_50": 120000,
            "percentile_75": 160000,
            "percentile_90": 200000,
            "year_over_year_change": 0.05,
            "trend_direction": "rising",
            "market_rate_range": "$80K - $200K"
        }

    def _track_emerging_skills(self, role: str, location: str) -> List[Dict[str, Any]]:
        """Track emerging skills for the role"""

        prompt = f"""Identify emerging skills for {role} in {location}.

Focus on:
- Skills seeing rapid growth in job postings
- New technologies gaining adoption
- Skills that command salary premiums
- Future-focused capabilities

Return JSON array:
[
  {{
    "skill": "skill name",
    "growth_rate": percent_as_decimal,
    "demand_trend": "surging|rising|stable",
    "salary_premium": percent_as_decimal,
    "adoption_stage": "emerging|growing|mainstream",
    "reason": "why this skill is trending"
  }}
]"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1200,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            import re
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                skills = json.loads(json_match.group(0))
                # Sort by growth rate
                skills.sort(key=lambda x: x.get('growth_rate', 0), reverse=True)
                return skills[:10]
        except:
            pass

        return []

    def _monitor_competitors(self, role: str, location: str) -> Dict[str, Any]:
        """Monitor competitor hiring activity"""

        # In production, scrape competitor job boards
        # Use AI to analyze patterns

        prompt = f"""Analyze competitor hiring patterns for {role} in {location}.

Consider major companies in the area.

Return JSON:
{{
  "active_companies": ["Company1", "Company2"],
  "hiring_velocity": "high|moderate|low",
  "avg_openings_per_company": number,
  "competitive_intensity": 0-100,
  "notable_trends": ["trend1", "trend2"],
  "market_leaders": ["company1", "company2"]
}}"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=700,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except:
            pass

        return {
            "active_companies": [],
            "hiring_velocity": "moderate",
            "competitive_intensity": 50
        }

    def _rank_sourcing_channels(self, role: str, location: str) -> List[Dict[str, Any]]:
        """Rank sourcing channels by effectiveness"""

        channels = [
            {
                'channel': 'LinkedIn Recruiter',
                'effectiveness': 85,
                'cost_per_hire': 5000,
                'time_to_response': '2-3 days',
                'quality_score': 90,
                'recommended_for': ['technical', 'professional']
            },
            {
                'channel': 'GitHub',
                'effectiveness': 80,
                'cost_per_hire': 3000,
                'time_to_response': '3-5 days',
                'quality_score': 95,
                'recommended_for': ['software_engineer', 'devops']
            },
            {
                'channel': 'Indeed',
                'effectiveness': 70,
                'cost_per_hire': 2000,
                'time_to_response': '1-2 days',
                'quality_score': 70,
                'recommended_for': ['entry_level', 'volume_hiring']
            },
            {
                'channel': 'Employee Referrals',
                'effectiveness': 95,
                'cost_per_hire': 2500,
                'time_to_response': '1-2 days',
                'quality_score': 95,
                'recommended_for': ['all_levels']
            },
            {
                'channel': 'Stack Overflow',
                'effectiveness': 75,
                'cost_per_hire': 3500,
                'time_to_response': '4-7 days',
                'quality_score': 90,
                'recommended_for': ['developers']
            },
            {
                'channel': 'Twitter/X',
                'effectiveness': 60,
                'cost_per_hire': 1000,
                'time_to_response': '1-3 days',
                'quality_score': 65,
                'recommended_for': ['creative', 'marketing']
            }
        ]

        # Use AI to personalize rankings
        prompt = f"""Rank these sourcing channels for hiring {role} in {location}.

Channels: {', '.join([c['channel'] for c in channels])}

Return JSON array of channel names in ranked order (most effective first):
["channel1", "channel2", ...]"""

        try:
            response = self.claude.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            import re
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                ranked_names = json.loads(json_match.group(0))

                # Reorder channels based on AI ranking
                channel_map = {c['channel']: c for c in channels}
                ranked_channels = []

                for name in ranked_names:
                    if name in channel_map:
                        ranked_channels.append(channel_map[name])

                # Add any missing channels
                for channel in channels:
                    if channel not in ranked_channels:
                        ranked_channels.append(channel)

                return ranked_channels
        except:
            pass

        # Default ranking by effectiveness
        channels.sort(key=lambda x: x['effectiveness'], reverse=True)
        return channels

    def _assess_negotiation_leverage(self, supply_demand: float, salary_trends: Dict) -> str:
        """Assess negotiation leverage"""

        # Tight market (low supply/demand ratio) = candidate leverage
        # Rising salaries = candidate leverage

        trend_direction = salary_trends.get('trend_direction', 'stable')
        yoy_change = salary_trends.get('year_over_year_change', 0)

        if supply_demand < 0.7:  # Very tight market
            if trend_direction == 'rising' or yoy_change > 0.05:
                return 'strong_candidate'
            else:
                return 'candidate'
        elif supply_demand < 1.0:  # Somewhat tight
            return 'candidate'
        elif supply_demand > 1.3:  # Loose market
            if trend_direction == 'falling':
                return 'strong_employer'
            else:
                return 'employer'
        else:
            return 'neutral'

    def _determine_market_tightness(self, supply_demand: float) -> str:
        """Determine overall market tightness"""

        if supply_demand < 0.5:
            return 'very_tight'
        elif supply_demand < 0.8:
            return 'tight'
        elif supply_demand < 1.2:
            return 'balanced'
        else:
            return 'loose'

    def _generate_recommendations(
        self, role: str, location: str, supply_demand: float,
        salary_trends: Dict, tightness: str
    ) -> List[str]:
        """Generate actionable recommendations"""

        recommendations = []

        # Market tightness recommendations
        if tightness in ['very_tight', 'tight']:
            recommendations.extend([
                f"⚡ Market is {tightness} - expect longer time-to-fill and higher salaries",
                "💰 Consider offering 10-15% above market median to attract top talent",
                "🎯 Focus on passive candidates who aren't actively job hunting",
                "⏱️ Move quickly - top candidates receive multiple offers within days"
            ])
        elif tightness == 'loose':
            recommendations.extend([
                "✅ Market favors employers - good time to hire",
                "💵 Salary expectations may be negotiable",
                "📊 Expect high application volumes - use pre-screening"
            ])

        # Salary trend recommendations
        trend = salary_trends.get('trend_direction', 'stable')
        yoy = salary_trends.get('year_over_year_change', 0)

        if trend == 'rising':
            recommendations.append(
                f"📈 Salaries rising {yoy*100:.1f}% YoY - budget accordingly"
            )

        # Supply/demand specific
        if supply_demand < 0.6:
            recommendations.append(
                "🌐 Consider remote candidates to expand talent pool"
            )

        return recommendations

    def _calculate_confidence(self) -> float:
        """Calculate confidence in the analysis"""

        # In production, base on data source availability
        # For now, return moderate confidence

        return 75.0

    def export_to_json(self, insight: MarketInsight) -> str:
        """Export insight to JSON"""

        data = asdict(insight)
        data['analyzed_at'] = data['analyzed_at'].isoformat()

        return json.dumps(data, indent=2)

    def generate_report(self, insight: MarketInsight) -> str:
        """Generate human-readable report"""

        report = f"""
Market Intelligence Report
{'=' * 60}

Role: {insight.role}
Location: {insight.location}
Generated: {insight.analyzed_at.strftime('%Y-%m-%d %H:%M')}

MARKET CONDITIONS: {insight.market_tightness.upper().replace('_', ' ')}
Supply/Demand Ratio: {insight.supply_demand_ratio:.2f}
{"(Tight market - more jobs than candidates)" if insight.supply_demand_ratio < 1 else "(Loose market - more candidates than jobs)"}

SALARY INSIGHTS
{'=' * 60}
Market Rate Range: {insight.salary_trends.get('market_rate_range', 'N/A')}

Percentiles:
  25th: ${insight.salary_trends.get('percentile_25', 0):,}
  50th (Median): ${insight.salary_trends.get('percentile_50', 0):,}
  75th: ${insight.salary_trends.get('percentile_75', 0):,}
  90th: ${insight.salary_trends.get('percentile_90', 0):,}

Trend: {insight.salary_trends.get('trend_direction', 'Unknown').upper()}
YoY Change: {insight.salary_trends.get('year_over_year_change', 0)*100:+.1f}%

EMERGING SKILLS
{'=' * 60}
"""

        for i, skill in enumerate(insight.skill_emergence[:5], 1):
            report += f"{i}. {skill['skill']} - {skill['demand_trend']}\n"
            report += f"   Growth: {skill.get('growth_rate', 0)*100:.0f}% | Premium: {skill.get('salary_premium', 0)*100:.0f}%\n"

        report += f"""
SOURCING CHANNELS (Ranked by Effectiveness)
{'=' * 60}
"""

        for i, channel in enumerate(insight.optimal_sourcing_channels[:5], 1):
            report += f"{i}. {channel['channel']} - Effectiveness: {channel['effectiveness']}/100\n"
            report += f"   Cost/Hire: ${channel['cost_per_hire']:,} | Quality: {channel['quality_score']}/100\n"

        report += f"""
COMPETITOR ACTIVITY
{'=' * 60}
Hiring Velocity: {insight.competitor_activity.get('hiring_velocity', 'Unknown')}
Competitive Intensity: {insight.competitor_activity.get('competitive_intensity', 0)}/100
Active Companies: {len(insight.competitor_activity.get('active_companies', []))}

NEGOTIATION LEVERAGE: {insight.negotiation_leverage.upper().replace('_', ' ')}

RECOMMENDATIONS
{'=' * 60}
"""

        for rec in insight.recommendations:
            report += f"{rec}\n"

        report += f"\nConfidence Score: {insight.confidence_score:.0f}%\n"

        return report

    def compare_locations(self, role: str, locations: List[str]) -> pd.DataFrame:
        """Compare market conditions across multiple locations"""

        results = []

        for location in locations:
            insight = self.get_insights(role, location)

            results.append({
                'Location': location,
                'Market Tightness': insight.market_tightness,
                'Supply/Demand': insight.supply_demand_ratio,
                'Median Salary': insight.salary_trends.get('percentile_50', 0),
                'Salary Trend': insight.salary_trends.get('trend_direction', 'unknown'),
                'YoY Change %': insight.salary_trends.get('year_over_year_change', 0) * 100,
                'Leverage': insight.negotiation_leverage
            })

        df = pd.DataFrame(results)
        return df

    def track_skill_trends(self, role: str, location: str, months: int = 6) -> Dict:
        """Track skill trends over time"""

        # In production, query historical data
        # For demo, generate sample trend data

        insight = self.get_insights(role, location)

        trends = {
            'role': role,
            'location': location,
            'period_months': months,
            'skills': []
        }

        for skill in insight.skill_emergence[:10]:
            # Generate sample historical data
            historical_demand = [
                skill.get('growth_rate', 0.1) * (1 + (i * 0.1))
                for i in range(months)
            ]

            trends['skills'].append({
                'name': skill['skill'],
                'current_demand': skill.get('growth_rate', 0),
                'historical_demand': historical_demand,
                'trend': skill.get('demand_trend', 'stable'),
                'forecast_next_month': historical_demand[-1] * 1.1
            })

        return trends


# Example usage
if __name__ == "__main__":
    import os

    # Initialize
    market = MarketIntelligence(
        anthropic_key=os.getenv('ANTHROPIC_API_KEY', ''),
        openai_key=os.getenv('OPENAI_API_KEY', '')
    )

    # Get insights
    insight = market.get_insights(
        role="Senior Software Engineer",
        location="San Francisco, CA"
    )

    # Print report
    print(market.generate_report(insight))

    # Export to JSON
    with open('market_intelligence.json', 'w') as f:
        f.write(market.export_to_json(insight))

    print("\n✅ Market intelligence saved to market_intelligence.json")

    # Compare locations
    print("\n📊 Comparing locations...\n")
    comparison = market.compare_locations(
        role="Senior Software Engineer",
        locations=["San Francisco, CA", "New York, NY", "Austin, TX", "Remote"]
    )
    print(comparison.to_string(index=False))

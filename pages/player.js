// ============================================
// PLAYER LAUNCHPAD PAGE
// ============================================

function renderPlayerPage() {
    const content = document.getElementById('app-content');

    const visualizationPreferenceKey = 'statVizPreference';
    let selectedVisualization = localStorage.getItem(visualizationPreferenceKey) || 'bar';

    const parseNumber = (value) => {
        if (value === null || value === undefined) return null;
        const cleaned = String(value).replace(/[^0-9.-]/g, '');
        if (!cleaned || cleaned === '-' || cleaned === '.') return null;
        const parsed = Number(cleaned);
        return Number.isNaN(parsed) ? null : parsed;
    };

    const formatStatValue = (original, valueNumber) => {
        const trimmed = String(original).trim();
        const hasPercent = trimmed.includes('%');
        const hasComma = trimmed.includes(',');
        const hasDecimal = trimmed.includes('.');
        const hasLeadingDot = trimmed.startsWith('.');
        const hasPlus = trimmed.startsWith('+');
        const decimals = hasDecimal ? trimmed.split('.')[1].length : 0;
        let formattedValue = valueNumber;

        if (hasPercent) {
            formattedValue = valueNumber.toFixed(1);
            return `${formattedValue}%`;
        }

        if (hasDecimal) {
            if (hasLeadingDot) {
                formattedValue = valueNumber.toFixed(3);
                return formattedValue.replace(/^0/, '');
            }
            if (decimals >= 2) {
                formattedValue = valueNumber.toFixed(2);
            } else {
                formattedValue = valueNumber.toFixed(1);
            }
            if (hasPlus && valueNumber >= 0) {
                return `+${formattedValue}`;
            }
            return `${formattedValue}`;
        }

        formattedValue = Math.round(valueNumber);
        if (hasComma) {
            return formattedValue.toLocaleString('en-US');
        }

        if (hasPlus && valueNumber >= 0) {
            return `+${formattedValue}`;
        }
        return `${formattedValue}`;
    };

    const adjustStatValue = (original, yearOffset) => {
        const baseValue = parseNumber(original);
        if (baseValue === null) return original;
        const multiplier = 1 + yearOffset * 0.015;
        let adjusted = baseValue * multiplier;
        if (String(original).includes('%')) {
            adjusted = Math.min(Math.max(adjusted, 0), 100);
        }
        return formatStatValue(original, adjusted);
    };

    const defaultRecentGames = {
        last10: [
            { date: 'Apr 12', opponent: '@ GSW', result: 'W 121-105', min: '36', pts: '33', reb: '7', ast: '11', fgPct: '58.3%', plusMinus: '+14' },
            { date: 'Apr 10', opponent: 'vs MIN', result: 'L 102-108', min: '38', pts: '28', reb: '10', ast: '9', fgPct: '47.6%', plusMinus: '-2' },
            { date: 'Apr 08', opponent: '@ DEN', result: 'W 117-110', min: '35', pts: '31', reb: '8', ast: '7', fgPct: '52.4%', plusMinus: '+6' },
            { date: 'Apr 06', opponent: 'vs PHX', result: 'W 124-118', min: '37', pts: '29', reb: '9', ast: '10', fgPct: '55.1%', plusMinus: '+5' },
            { date: 'Apr 04', opponent: '@ SAC', result: 'L 109-114', min: '34', pts: '24', reb: '6', ast: '8', fgPct: '44.9%', plusMinus: '-4' },
            { date: 'Apr 02', opponent: 'vs DAL', result: 'W 120-112', min: '33', pts: '27', reb: '12', ast: '6', fgPct: '50.0%', plusMinus: '+9' },
            { date: 'Mar 30', opponent: '@ HOU', result: 'W 113-106', min: '36', pts: '32', reb: '9', ast: '5', fgPct: '57.9%', plusMinus: '+8' },
            { date: 'Mar 28', opponent: 'vs OKC', result: 'L 101-104', min: '35', pts: '22', reb: '7', ast: '9', fgPct: '42.5%', plusMinus: '-1' },
            { date: 'Mar 26', opponent: '@ MEM', result: 'W 118-109', min: '32', pts: '26', reb: '11', ast: '7', fgPct: '53.6%', plusMinus: '+10' },
            { date: 'Mar 24', opponent: 'vs SAS', result: 'W 129-115', min: '30', pts: '30', reb: '8', ast: '12', fgPct: '60.0%', plusMinus: '+12' }
        ],
        season: [
            { date: 'Mar 22', opponent: '@ BOS', result: 'L 98-110', min: '34', pts: '21', reb: '5', ast: '7', fgPct: '41.7%', plusMinus: '-9' },
            { date: 'Mar 19', opponent: 'vs MIA', result: 'W 112-99', min: '36', pts: '27', reb: '10', ast: '6', fgPct: '52.2%', plusMinus: '+11' },
            { date: 'Mar 17', opponent: '@ ATL', result: 'W 119-113', min: '35', pts: '29', reb: '8', ast: '9', fgPct: '49.1%', plusMinus: '+3' },
            { date: 'Mar 14', opponent: 'vs DET', result: 'W 126-102', min: '28', pts: '24', reb: '6', ast: '10', fgPct: '55.6%', plusMinus: '+15' },
            { date: 'Mar 12', opponent: '@ ORL', result: 'L 105-108', min: '37', pts: '26', reb: '9', ast: '8', fgPct: '46.3%', plusMinus: '-3' },
            { date: 'Mar 10', opponent: 'vs NYK', result: 'W 118-111', min: '33', pts: '25', reb: '7', ast: '11', fgPct: '50.9%', plusMinus: '+7' },
            { date: 'Mar 08', opponent: '@ CHI', result: 'W 121-116', min: '36', pts: '30', reb: '12', ast: '5', fgPct: '53.0%', plusMinus: '+6' },
            { date: 'Mar 05', opponent: 'vs CLE', result: 'L 103-107', min: '34', pts: '23', reb: '8', ast: '7', fgPct: '44.4%', plusMinus: '-5' },
            { date: 'Mar 03', opponent: '@ TOR', result: 'W 115-109', min: '32', pts: '28', reb: '9', ast: '6', fgPct: '51.7%', plusMinus: '+4' },
            { date: 'Feb 29', opponent: 'vs UTA', result: 'W 123-118', min: '35', pts: '31', reb: '10', ast: '8', fgPct: '54.8%', plusMinus: '+2' },
            { date: 'Feb 27', opponent: '@ POR', result: 'W 117-104', min: '31', pts: '22', reb: '6', ast: '9', fgPct: '48.2%', plusMinus: '+9' },
            { date: 'Feb 25', opponent: 'vs DEN', result: 'L 107-112', min: '37', pts: '26', reb: '8', ast: '5', fgPct: '45.0%', plusMinus: '-6' }
        ],
        postseason: [
            { date: 'May 02', opponent: '@ DEN', result: 'L 101-112', min: '40', pts: '29', reb: '9', ast: '7', fgPct: '48.6%', plusMinus: '-8' },
            { date: 'Apr 30', opponent: 'vs DEN', result: 'W 114-108', min: '41', pts: '34', reb: '12', ast: '10', fgPct: '56.2%', plusMinus: '+5' },
            { date: 'Apr 27', opponent: '@ DEN', result: 'L 105-110', min: '39', pts: '27', reb: '8', ast: '6', fgPct: '46.8%', plusMinus: '-4' },
            { date: 'Apr 25', opponent: 'vs DEN', result: 'W 119-113', min: '42', pts: '31', reb: '11', ast: '9', fgPct: '52.9%', plusMinus: '+3' }
        ]
    };

    const mockQueryResults = [
        {
            title: 'Efficiency dip on 0 days rest',
            summary: 'True shooting drops 4.8% with a 2.1% usage decline across the last 12 back-to-backs.',
            tag: 'Recovery Impact',
            confidence: 'High'
        },
        {
            title: 'Clutch usage spike',
            summary: 'Late-game possessions rise 12% with a +6.4 net rating in the final 3 minutes.',
            tag: 'Clutch Profile',
            confidence: 'Medium'
        },
        {
            title: 'Pace vs opponent top-10 defense',
            summary: 'Possessions drop 3.2 per game, but scoring efficiency holds steady at 1.12 PPP.',
            tag: 'Matchup Trend',
            confidence: 'High'
        }
    ];

    const opponentPools = {
        NBA: ['@ BOS', 'vs MIA', '@ MIL', 'vs PHX', '@ DEN', 'vs GSW', '@ NYK', 'vs DAL', '@ SAC', 'vs LAC', '@ ATL', 'vs MIN'],
        NFL: ['@ BUF', 'vs CIN', '@ BAL', 'vs MIA', '@ DAL', 'vs PIT', '@ KC', 'vs NYJ', '@ LV', 'vs GB', '@ LAC', 'vs NE'],
        MLB: ['@ NYY', 'vs BOS', '@ HOU', 'vs STL', '@ CHC', 'vs SD', '@ SF', 'vs SEA', '@ ATL', 'vs NYM', '@ TOR', 'vs TEX'],
        NHL: ['@ BOS', 'vs NYR', '@ TBL', 'vs TOR', '@ VGK', 'vs COL', '@ EDM', 'vs PIT', '@ WSH', 'vs DAL', '@ LAK', 'vs NJD']
    };

    const formatScore = (base, variance, index) => {
        const teamScore = Math.max(80, Math.round(base + variance));
        const swing = (index % 6) * 2 - 5;
        const oppScore = Math.max(78, Math.round(base + variance - swing));
        const isWin = teamScore >= oppScore;
        return {
            result: `${isWin ? 'W' : 'L'} ${teamScore}-${oppScore}`,
            isWin
        };
    };

    const formatSigned = (value) => `${value >= 0 ? '+' : ''}${value}`;

    const buildGameLine = (profile, year, index, label) => {
        const { basePts, baseReb, baseAst, baseMin, baseFg } = profile;
        const yearOffset = year - profile.currentYear;
        const variance = (index % 5) - 2;
        const pts = Math.max(4, Math.round(basePts + yearOffset * 0.6 + variance));
        const reb = Math.max(0, Math.round(baseReb + yearOffset * 0.2 + (index % 3) - 1));
        const ast = Math.max(0, Math.round(baseAst + yearOffset * 0.2 + (index % 4) - 1));
        const min = Math.max(18, Math.round(baseMin + yearOffset * 0.3 + (index % 2)));
        const fgPct = Math.min(72, Math.max(32, baseFg + yearOffset * 0.2 + variance * 0.6));
        const plusMinus = Math.round((variance + yearOffset) * 1.5);
        const score = formatScore(104 + basePts + variance * 2, variance * 2, index);
        const day = String(28 - index).padStart(2, '0');
        const date = `${label} ${day}`;

        return {
            date,
            opponent: profile.opponents[index % profile.opponents.length],
            result: score.result,
            min: String(min),
            pts: String(pts),
            reb: String(reb),
            ast: String(ast),
            fgPct: `${fgPct.toFixed(1)}%`,
            plusMinus: formatSigned(plusMinus)
        };
    };

    const buildPlayerSeasonGames = (league, gameProfile, activeEndYear, year) => {
        const opponents = opponentPools[league] || opponentPools.NBA;
        const profile = {
            basePts: gameProfile.basePts,
            baseReb: gameProfile.baseReb,
            baseAst: gameProfile.baseAst,
            baseMin: gameProfile.baseMin,
            baseFg: gameProfile.baseFg,
            currentYear: activeEndYear,
            opponents
        };

        return {
            last10: Array.from({ length: 10 }, (_, index) => buildGameLine(profile, year, index, 'Apr')),
            season: Array.from({ length: 10 }, (_, index) => buildGameLine(profile, year, index, 'Mar')),
            postseason: Array.from({ length: 4 }, (_, index) => buildGameLine(profile, year, index, 'May'))
        };
    };

    const buildSeasonData = (primaryStats, extraStats, startYear, endYear, gamesFactory) => {
        const seasons = {};
        for (let year = startYear; year <= endYear; year += 1) {
            const yearOffset = year - endYear;
            const adjustedPrimary = primaryStats.map((stat) => ({
                ...stat,
                value: adjustStatValue(stat.value, yearOffset)
            }));
            const adjustedExtra = extraStats.map((stat) => ({
                ...stat,
                value: adjustStatValue(stat.value, yearOffset)
            }));
            seasons[year] = {
                primaryStats: adjustedPrimary,
                extraStats: adjustedExtra,
                recentGames: gamesFactory ? gamesFactory(year) : defaultRecentGames
            };
        }
        return seasons;
    };

    const playerDirectory = [
        {
            name: 'LeBron James',
            league: 'NBA',
            team: 'Los Angeles Lakers',
            position: 'Forward',
            number: '23',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb762hOqiz8Pd9XLw6yGDJ7aF-xV7548_oshurjFQdOC1dZ6Us74KneDs4efactWzbWl69q6eGACjxDtXhiEl8Ttjv3dxEdkB7VxRJY8uajCL3HZXNaaT__dz9eauyv6GRSGSYab7f3QK_Ay6MpeciFpREchq83g8jMYmr8eaOZfqekpoF4EIUlxi0FGgzaSZFx2d854nEq3NynR0sC6f4Z9Bs8dzwZsRvcBpOVsXsN9TwpRLG5YIBNIYOKZqr8jvCRYY-kdx-xGg',
            activeStartYear: 2018,
            activeEndYear: 2025,
            gameProfile: { basePts: 27, baseReb: 8, baseAst: 8, baseMin: 36, baseFg: 52 },
            primaryStats: [
                { label: 'PPG', value: '25.7' },
                { label: 'RPG', value: '7.3' },
                { label: 'APG', value: '8.3' },
                { label: 'BLK', value: '0.8' },
                { label: 'SPG', value: '1.2' }
            ],
            extraStats: [
                { label: 'FG%', value: '54.1%' },
                { label: '3P%', value: '38.6%' },
                { label: 'FT%', value: '76.4%' },
                { label: 'eFG%', value: '58.9%' },
                { label: 'USG%', value: '32.1%' },
                { label: 'PER', value: '23.9' },
                { label: 'TS%', value: '61.2%' },
                { label: 'OREB', value: '1.2' }
            ],
            recentGames: buildPlayerSeasonGames('NBA', { basePts: 27, baseReb: 8, baseAst: 8, baseMin: 36, baseFg: 52 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'PPG', value: '25.7' },
                    { label: 'RPG', value: '7.3' },
                    { label: 'APG', value: '8.3' },
                    { label: 'BLK', value: '0.8' },
                    { label: 'SPG', value: '1.2' }
                ],
                [
                    { label: 'FG%', value: '54.1%' },
                    { label: '3P%', value: '38.6%' },
                    { label: 'FT%', value: '76.4%' },
                    { label: 'eFG%', value: '58.9%' },
                    { label: 'USG%', value: '32.1%' },
                    { label: 'PER', value: '23.9' },
                    { label: 'TS%', value: '61.2%' },
                    { label: 'OREB', value: '1.2' }
                ],
                2018,
                2025,
                (year) => buildPlayerSeasonGames('NBA', { basePts: 27, baseReb: 8, baseAst: 8, baseMin: 36, baseFg: 52 }, 2025, year)
            )
        },
        {
            name: 'Stephen Curry',
            league: 'NBA',
            team: 'Golden State Warriors',
            position: 'Guard',
            number: '30',
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2015,
            activeEndYear: 2025,
            gameProfile: { basePts: 29, baseReb: 5, baseAst: 6, baseMin: 34, baseFg: 47 },
            primaryStats: [
                { label: 'PPG', value: '27.4' },
                { label: 'RPG', value: '4.6' },
                { label: 'APG', value: '5.1' },
                { label: 'BLK', value: '0.3' },
                { label: 'SPG', value: '1.1' }
            ],
            extraStats: [
                { label: 'FG%', value: '47.8%' },
                { label: '3P%', value: '41.2%' },
                { label: 'FT%', value: '91.4%' },
                { label: 'eFG%', value: '58.1%' },
                { label: 'USG%', value: '30.4%' },
                { label: 'PER', value: '24.8' },
                { label: 'TS%', value: '64.3%' },
                { label: 'TOV', value: '3.1' }
            ],
            recentGames: buildPlayerSeasonGames('NBA', { basePts: 29, baseReb: 5, baseAst: 6, baseMin: 34, baseFg: 47 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'PPG', value: '27.4' },
                    { label: 'RPG', value: '4.6' },
                    { label: 'APG', value: '5.1' },
                    { label: 'BLK', value: '0.3' },
                    { label: 'SPG', value: '1.1' }
                ],
                [
                    { label: 'FG%', value: '47.8%' },
                    { label: '3P%', value: '41.2%' },
                    { label: 'FT%', value: '91.4%' },
                    { label: 'eFG%', value: '58.1%' },
                    { label: 'USG%', value: '30.4%' },
                    { label: 'PER', value: '24.8' },
                    { label: 'TS%', value: '64.3%' },
                    { label: 'TOV', value: '3.1' }
                ],
                2015,
                2025,
                (year) => buildPlayerSeasonGames('NBA', { basePts: 29, baseReb: 5, baseAst: 6, baseMin: 34, baseFg: 47 }, 2025, year)
            )
        },
        {
            name: 'Giannis Antetokounmpo',
            league: 'NBA',
            team: 'Milwaukee Bucks',
            position: 'Forward',
            number: '34',
            imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2014,
            activeEndYear: 2025,
            gameProfile: { basePts: 30, baseReb: 11, baseAst: 6, baseMin: 35, baseFg: 57 },
            primaryStats: [
                { label: 'PPG', value: '30.1' },
                { label: 'RPG', value: '11.4' },
                { label: 'APG', value: '6.3' },
                { label: 'BLK', value: '1.2' },
                { label: 'SPG', value: '1.0' }
            ],
            extraStats: [
                { label: 'FG%', value: '57.8%' },
                { label: '3P%', value: '29.1%' },
                { label: 'FT%', value: '67.4%' },
                { label: 'eFG%', value: '59.2%' },
                { label: 'USG%', value: '33.8%' },
                { label: 'PER', value: '29.2' },
                { label: 'TS%', value: '61.8%' },
                { label: 'OREB', value: '2.1' }
            ],
            recentGames: buildPlayerSeasonGames('NBA', { basePts: 30, baseReb: 11, baseAst: 6, baseMin: 35, baseFg: 57 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'PPG', value: '30.1' },
                    { label: 'RPG', value: '11.4' },
                    { label: 'APG', value: '6.3' },
                    { label: 'BLK', value: '1.2' },
                    { label: 'SPG', value: '1.0' }
                ],
                [
                    { label: 'FG%', value: '57.8%' },
                    { label: '3P%', value: '29.1%' },
                    { label: 'FT%', value: '67.4%' },
                    { label: 'eFG%', value: '59.2%' },
                    { label: 'USG%', value: '33.8%' },
                    { label: 'PER', value: '29.2' },
                    { label: 'TS%', value: '61.8%' },
                    { label: 'OREB', value: '2.1' }
                ],
                2014,
                2025,
                (year) => buildPlayerSeasonGames('NBA', { basePts: 30, baseReb: 11, baseAst: 6, baseMin: 35, baseFg: 57 }, 2025, year)
            )
        },
        {
            name: 'Patrick Mahomes',
            league: 'NFL',
            team: 'Kansas City Chiefs',
            position: 'Quarterback',
            number: '15',
            imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2018,
            activeEndYear: 2025,
            gameProfile: { basePts: 28, baseReb: 4, baseAst: 6, baseMin: 35, baseFg: 62 },
            primaryStats: [
                { label: 'Pass Yds', value: '4,358' },
                { label: 'Pass TD', value: '31' },
                { label: 'INT', value: '11' },
                { label: 'Comp%', value: '67.2%' },
                { label: 'QBR', value: '72.8' }
            ],
            extraStats: [
                { label: 'Y/A', value: '7.4' },
                { label: 'Sacks', value: '28' },
                { label: 'Rush Yds', value: '389' },
                { label: 'Rush TD', value: '4' },
                { label: 'EPA/Play', value: '0.18' },
                { label: 'Red Zone TD%', value: '61%' },
                { label: 'Passer Rt', value: '101.6' },
                { label: '3rd Down%', value: '45%' }
            ],
            recentGames: buildPlayerSeasonGames('NFL', { basePts: 28, baseReb: 4, baseAst: 6, baseMin: 35, baseFg: 62 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'Pass Yds', value: '4,358' },
                    { label: 'Pass TD', value: '31' },
                    { label: 'INT', value: '11' },
                    { label: 'Comp%', value: '67.2%' },
                    { label: 'QBR', value: '72.8' }
                ],
                [
                    { label: 'Y/A', value: '7.4' },
                    { label: 'Sacks', value: '28' },
                    { label: 'Rush Yds', value: '389' },
                    { label: 'Rush TD', value: '4' },
                    { label: 'EPA/Play', value: '0.18' },
                    { label: 'Red Zone TD%', value: '61%' },
                    { label: 'Passer Rt', value: '101.6' },
                    { label: '3rd Down%', value: '45%' }
                ],
                2018,
                2025,
                (year) => buildPlayerSeasonGames('NFL', { basePts: 28, baseReb: 4, baseAst: 6, baseMin: 35, baseFg: 62 }, 2025, year)
            )
        },
        {
            name: 'Justin Jefferson',
            league: 'NFL',
            team: 'Minnesota Vikings',
            position: 'Wide Receiver',
            number: '18',
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2020,
            activeEndYear: 2025,
            gameProfile: { basePts: 24, baseReb: 6, baseAst: 5, baseMin: 33, baseFg: 51 },
            primaryStats: [
                { label: 'REC', value: '114' },
                { label: 'Rec Yds', value: '1,620' },
                { label: 'Rec TD', value: '9' },
                { label: 'Yds/Rec', value: '14.2' },
                { label: 'Catch%', value: '66.4%' }
            ],
            extraStats: [
                { label: 'Targets', value: '172' },
                { label: 'Air Yds', value: '1,496' },
                { label: 'YAC', value: '482' },
                { label: '1st Downs', value: '78' },
                { label: 'Red Zone Tgts', value: '21' },
                { label: 'Contested%', value: '47%' },
                { label: 'Drop%', value: '2.8%' },
                { label: 'Slot%', value: '31%' }
            ],
            recentGames: buildPlayerSeasonGames('NFL', { basePts: 24, baseReb: 6, baseAst: 5, baseMin: 33, baseFg: 51 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'REC', value: '114' },
                    { label: 'Rec Yds', value: '1,620' },
                    { label: 'Rec TD', value: '9' },
                    { label: 'Yds/Rec', value: '14.2' },
                    { label: 'Catch%', value: '66.4%' }
                ],
                [
                    { label: 'Targets', value: '172' },
                    { label: 'Air Yds', value: '1,496' },
                    { label: 'YAC', value: '482' },
                    { label: '1st Downs', value: '78' },
                    { label: 'Red Zone Tgts', value: '21' },
                    { label: 'Contested%', value: '47%' },
                    { label: 'Drop%', value: '2.8%' },
                    { label: 'Slot%', value: '31%' }
                ],
                2020,
                2025,
                (year) => buildPlayerSeasonGames('NFL', { basePts: 24, baseReb: 6, baseAst: 5, baseMin: 33, baseFg: 51 }, 2025, year)
            )
        },
        {
            name: 'Josh Allen',
            league: 'NFL',
            team: 'Buffalo Bills',
            position: 'Quarterback',
            number: '17',
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2018,
            activeEndYear: 2025,
            gameProfile: { basePts: 26, baseReb: 5, baseAst: 6, baseMin: 34, baseFg: 60 },
            primaryStats: [
                { label: 'Pass Yds', value: '4,284' },
                { label: 'Pass TD', value: '29' },
                { label: 'INT', value: '12' },
                { label: 'Comp%', value: '66.1%' },
                { label: 'QBR', value: '68.4' }
            ],
            extraStats: [
                { label: 'Y/A', value: '7.2' },
                { label: 'Sacks', value: '33' },
                { label: 'Rush Yds', value: '524' },
                { label: 'Rush TD', value: '8' },
                { label: 'EPA/Play', value: '0.16' },
                { label: 'Red Zone TD%', value: '58%' },
                { label: 'Passer Rt', value: '97.8' },
                { label: '3rd Down%', value: '43%' }
            ],
            recentGames: buildPlayerSeasonGames('NFL', { basePts: 26, baseReb: 5, baseAst: 6, baseMin: 34, baseFg: 60 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'Pass Yds', value: '4,284' },
                    { label: 'Pass TD', value: '29' },
                    { label: 'INT', value: '12' },
                    { label: 'Comp%', value: '66.1%' },
                    { label: 'QBR', value: '68.4' }
                ],
                [
                    { label: 'Y/A', value: '7.2' },
                    { label: 'Sacks', value: '33' },
                    { label: 'Rush Yds', value: '524' },
                    { label: 'Rush TD', value: '8' },
                    { label: 'EPA/Play', value: '0.16' },
                    { label: 'Red Zone TD%', value: '58%' },
                    { label: 'Passer Rt', value: '97.8' },
                    { label: '3rd Down%', value: '43%' }
                ],
                2018,
                2025,
                (year) => buildPlayerSeasonGames('NFL', { basePts: 26, baseReb: 5, baseAst: 6, baseMin: 34, baseFg: 60 }, 2025, year)
            )
        },
        {
            name: 'Mookie Betts',
            league: 'MLB',
            team: 'Los Angeles Dodgers',
            position: 'Outfielder',
            number: '50',
            imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2014,
            activeEndYear: 2025,
            gameProfile: { basePts: 22, baseReb: 6, baseAst: 5, baseMin: 32, baseFg: 48 },
            primaryStats: [
                { label: 'AVG', value: '.292' },
                { label: 'HR', value: '28' },
                { label: 'RBI', value: '90' },
                { label: 'OBP', value: '.385' },
                { label: 'SLG', value: '.520' }
            ],
            extraStats: [
                { label: 'OPS', value: '.905' },
                { label: 'SB', value: '14' },
                { label: 'BB', value: '78' },
                { label: 'SO', value: '98' },
                { label: 'wRC+', value: '142' },
                { label: 'Hard Hit%', value: '43%' },
                { label: 'BABIP', value: '.314' },
                { label: 'ISO', value: '.228' }
            ],
            recentGames: buildPlayerSeasonGames('MLB', { basePts: 22, baseReb: 6, baseAst: 5, baseMin: 32, baseFg: 48 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'AVG', value: '.292' },
                    { label: 'HR', value: '28' },
                    { label: 'RBI', value: '90' },
                    { label: 'OBP', value: '.385' },
                    { label: 'SLG', value: '.520' }
                ],
                [
                    { label: 'OPS', value: '.905' },
                    { label: 'SB', value: '14' },
                    { label: 'BB', value: '78' },
                    { label: 'SO', value: '98' },
                    { label: 'wRC+', value: '142' },
                    { label: 'Hard Hit%', value: '43%' },
                    { label: 'BABIP', value: '.314' },
                    { label: 'ISO', value: '.228' }
                ],
                2014,
                2025,
                (year) => buildPlayerSeasonGames('MLB', { basePts: 22, baseReb: 6, baseAst: 5, baseMin: 32, baseFg: 48 }, 2025, year)
            )
        },
        {
            name: 'Shohei Ohtani',
            league: 'MLB',
            team: 'Los Angeles Dodgers',
            position: 'Pitcher/DH',
            number: '17',
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2018,
            activeEndYear: 2025,
            gameProfile: { basePts: 20, baseReb: 7, baseAst: 4, baseMin: 32, baseFg: 47 },
            primaryStats: [
                { label: 'ERA', value: '3.14' },
                { label: 'WHIP', value: '1.05' },
                { label: 'SO', value: '182' },
                { label: 'IP', value: '152.1' },
                { label: 'BB/9', value: '2.7' }
            ],
            extraStats: [
                { label: 'K/9', value: '10.8' },
                { label: 'HR/9', value: '0.9' },
                { label: 'FIP', value: '3.02' },
                { label: 'xFIP', value: '3.18' },
                { label: 'LOB%', value: '77%' },
                { label: 'GB%', value: '45%' },
                { label: 'CSW%', value: '29%' },
                { label: 'Starts', value: '28' }
            ],
            recentGames: buildPlayerSeasonGames('MLB', { basePts: 20, baseReb: 7, baseAst: 4, baseMin: 32, baseFg: 47 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'ERA', value: '3.14' },
                    { label: 'WHIP', value: '1.05' },
                    { label: 'SO', value: '182' },
                    { label: 'IP', value: '152.1' },
                    { label: 'BB/9', value: '2.7' }
                ],
                [
                    { label: 'K/9', value: '10.8' },
                    { label: 'HR/9', value: '0.9' },
                    { label: 'FIP', value: '3.02' },
                    { label: 'xFIP', value: '3.18' },
                    { label: 'LOB%', value: '77%' },
                    { label: 'GB%', value: '45%' },
                    { label: 'CSW%', value: '29%' },
                    { label: 'Starts', value: '28' }
                ],
                2018,
                2025,
                (year) => buildPlayerSeasonGames('MLB', { basePts: 20, baseReb: 7, baseAst: 4, baseMin: 32, baseFg: 47 }, 2025, year)
            )
        },
        {
            name: 'Ronald Acuna Jr.',
            league: 'MLB',
            team: 'Atlanta Braves',
            position: 'Outfielder',
            number: '13',
            imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2018,
            activeEndYear: 2025,
            gameProfile: { basePts: 24, baseReb: 6, baseAst: 5, baseMin: 33, baseFg: 50 },
            primaryStats: [
                { label: 'AVG', value: '.304' },
                { label: 'HR', value: '32' },
                { label: 'RBI', value: '88' },
                { label: 'OBP', value: '.401' },
                { label: 'SLG', value: '.535' }
            ],
            extraStats: [
                { label: 'OPS', value: '.936' },
                { label: 'SB', value: '41' },
                { label: 'BB', value: '86' },
                { label: 'SO', value: '114' },
                { label: 'wRC+', value: '148' },
                { label: 'Hard Hit%', value: '49%' },
                { label: 'BABIP', value: '.330' },
                { label: 'ISO', value: '.231' }
            ],
            recentGames: buildPlayerSeasonGames('MLB', { basePts: 24, baseReb: 6, baseAst: 5, baseMin: 33, baseFg: 50 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'AVG', value: '.304' },
                    { label: 'HR', value: '32' },
                    { label: 'RBI', value: '88' },
                    { label: 'OBP', value: '.401' },
                    { label: 'SLG', value: '.535' }
                ],
                [
                    { label: 'OPS', value: '.936' },
                    { label: 'SB', value: '41' },
                    { label: 'BB', value: '86' },
                    { label: 'SO', value: '114' },
                    { label: 'wRC+', value: '148' },
                    { label: 'Hard Hit%', value: '49%' },
                    { label: 'BABIP', value: '.330' },
                    { label: 'ISO', value: '.231' }
                ],
                2018,
                2025,
                (year) => buildPlayerSeasonGames('MLB', { basePts: 24, baseReb: 6, baseAst: 5, baseMin: 33, baseFg: 50 }, 2025, year)
            )
        },
        {
            name: 'Connor McDavid',
            league: 'NHL',
            team: 'Edmonton Oilers',
            position: 'Center',
            number: '97',
            imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2016,
            activeEndYear: 2025,
            gameProfile: { basePts: 26, baseReb: 7, baseAst: 8, baseMin: 21, baseFg: 55 },
            primaryStats: [
                { label: 'G', value: '42' },
                { label: 'A', value: '78' },
                { label: 'PTS', value: '120' },
                { label: '+/-', value: '+26' },
                { label: 'SOG', value: '296' }
            ],
            extraStats: [
                { label: 'PIM', value: '36' },
                { label: 'PPG', value: '15' },
                { label: 'SHG', value: '2' },
                { label: 'TOI', value: '22.5' },
                { label: 'FO%', value: '53.1%' },
                { label: 'Hits', value: '48' },
                { label: 'Blocks', value: '32' },
                { label: 'GWG', value: '6' }
            ],
            recentGames: buildPlayerSeasonGames('NHL', { basePts: 26, baseReb: 7, baseAst: 8, baseMin: 21, baseFg: 55 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'G', value: '42' },
                    { label: 'A', value: '78' },
                    { label: 'PTS', value: '120' },
                    { label: '+/-', value: '+26' },
                    { label: 'SOG', value: '296' }
                ],
                [
                    { label: 'PIM', value: '36' },
                    { label: 'PPG', value: '15' },
                    { label: 'SHG', value: '2' },
                    { label: 'TOI', value: '22.5' },
                    { label: 'FO%', value: '53.1%' },
                    { label: 'Hits', value: '48' },
                    { label: 'Blocks', value: '32' },
                    { label: 'GWG', value: '6' }
                ],
                2016,
                2025,
                (year) => buildPlayerSeasonGames('NHL', { basePts: 26, baseReb: 7, baseAst: 8, baseMin: 21, baseFg: 55 }, 2025, year)
            )
        },
        {
            name: 'Cale Makar',
            league: 'NHL',
            team: 'Colorado Avalanche',
            position: 'Defense',
            number: '8',
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2019,
            activeEndYear: 2025,
            gameProfile: { basePts: 18, baseReb: 6, baseAst: 7, baseMin: 22, baseFg: 52 },
            primaryStats: [
                { label: 'G', value: '24' },
                { label: 'A', value: '65' },
                { label: 'PTS', value: '89' },
                { label: '+/-', value: '+32' },
                { label: 'SOG', value: '238' }
            ],
            extraStats: [
                { label: 'PIM', value: '18' },
                { label: 'PPG', value: '9' },
                { label: 'SHG', value: '1' },
                { label: 'TOI', value: '25.1' },
                { label: 'FO%', value: '0.0%' },
                { label: 'Hits', value: '54' },
                { label: 'Blocks', value: '72' },
                { label: 'GWG', value: '5' }
            ],
            recentGames: buildPlayerSeasonGames('NHL', { basePts: 18, baseReb: 6, baseAst: 7, baseMin: 22, baseFg: 52 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'G', value: '24' },
                    { label: 'A', value: '65' },
                    { label: 'PTS', value: '89' },
                    { label: '+/-', value: '+32' },
                    { label: 'SOG', value: '238' }
                ],
                [
                    { label: 'PIM', value: '18' },
                    { label: 'PPG', value: '9' },
                    { label: 'SHG', value: '1' },
                    { label: 'TOI', value: '25.1' },
                    { label: 'FO%', value: '0.0%' },
                    { label: 'Hits', value: '54' },
                    { label: 'Blocks', value: '72' },
                    { label: 'GWG', value: '5' }
                ],
                2019,
                2025,
                (year) => buildPlayerSeasonGames('NHL', { basePts: 18, baseReb: 6, baseAst: 7, baseMin: 22, baseFg: 52 }, 2025, year)
            )
        },
        {
            name: 'Auston Matthews',
            league: 'NHL',
            team: 'Toronto Maple Leafs',
            position: 'Center',
            number: '34',
            imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=512&q=80',
            activeStartYear: 2016,
            activeEndYear: 2025,
            gameProfile: { basePts: 25, baseReb: 6, baseAst: 5, baseMin: 21, baseFg: 54 },
            primaryStats: [
                { label: 'G', value: '54' },
                { label: 'A', value: '46' },
                { label: 'PTS', value: '100' },
                { label: '+/-', value: '+18' },
                { label: 'SOG', value: '322' }
            ],
            extraStats: [
                { label: 'PIM', value: '20' },
                { label: 'PPG', value: '18' },
                { label: 'SHG', value: '1' },
                { label: 'TOI', value: '21.8' },
                { label: 'FO%', value: '52.4%' },
                { label: 'Hits', value: '62' },
                { label: 'Blocks', value: '28' },
                { label: 'GWG', value: '7' }
            ],
            recentGames: buildPlayerSeasonGames('NHL', { basePts: 25, baseReb: 6, baseAst: 5, baseMin: 21, baseFg: 54 }, 2025, 2025),
            seasons: buildSeasonData(
                [
                    { label: 'G', value: '54' },
                    { label: 'A', value: '46' },
                    { label: 'PTS', value: '100' },
                    { label: '+/-', value: '+18' },
                    { label: 'SOG', value: '322' }
                ],
                [
                    { label: 'PIM', value: '20' },
                    { label: 'PPG', value: '18' },
                    { label: 'SHG', value: '1' },
                    { label: 'TOI', value: '21.8' },
                    { label: 'FO%', value: '52.4%' },
                    { label: 'Hits', value: '62' },
                    { label: 'Blocks', value: '28' },
                    { label: 'GWG', value: '7' }
                ],
                2016,
                2025,
                (year) => buildPlayerSeasonGames('NHL', { basePts: 25, baseReb: 6, baseAst: 5, baseMin: 21, baseFg: 54 }, 2025, year)
            )
        }
    ];

    const leagueOptions = ['NBA', 'NFL', 'MLB', 'NHL'];
    const defaultPlayer = playerDirectory[0];
    let activePlayer = defaultPlayer;
    let activeSeasonYear = activePlayer.activeEndYear;
    const initialYears = [];
    if (defaultPlayer.activeStartYear && defaultPlayer.activeEndYear) {
        for (let year = defaultPlayer.activeStartYear; year <= defaultPlayer.activeEndYear; year += 1) {
            initialYears.push(year);
        }
    }

    content.innerHTML = `
        <div class="flex flex-col gap-8 fade-in">
            <!-- Search Bar -->
            <div class="bg-surface-dark border border-slate-800 rounded-xl p-4 @container shadow-card">
                <div class="flex flex-col gap-3 @[520px]:flex-row @[520px]:items-center">
                    <div class="flex flex-col gap-2 flex-1">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-500">League</label>
                        <div class="relative">
                            <select id="league-select" aria-label="Select league"
                                class="form-select w-full bg-transparent border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-primary focus:border-primary">
                                <option value="" selected>Select league</option>
                                ${leagueOptions.map((league) => `<option value="${league}">${league}</option>`).join('')}
                            </select>
                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none">expand_more</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 flex-[1.4] relative">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Player</label>
                        <input id="player-input" type="text" aria-label="Search player" aria-expanded="false" aria-controls="player-dropdown" disabled
                            placeholder="Select a league first..."
                            class="form-input w-full bg-transparent border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed" />
                        <div id="player-dropdown" role="listbox"
                            class="absolute top-full mt-2 w-full rounded-xl border border-slate-800 bg-[#0B101B] shadow-card z-20 hidden max-h-64 overflow-y-auto">
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 @[520px]:self-end">
                        <button id="player-apply"
                            class="h-10 px-5 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wide shadow-glow hover:bg-primary-hover transition-colors">
                            Search
                        </button>
                    </div>
                </div>
                <p id="player-feedback" class="text-xs text-orange-400 font-semibold mt-3 hidden"></p>
            </div>

            <!-- Hero Section -->
            <div class="flex flex-col @container">
                <div class="flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center bg-surface-dark p-6 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
                    <!-- Background Accent -->
                    <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div class="flex gap-6 relative z-10">
                        <div class="relative group">
                            <div id="player-avatar" class="bg-center bg-no-repeat aspect-square bg-cover rounded-xl min-h-32 w-32 shadow-lg ring-1 ring-white/10" style='background-image: url("${defaultPlayer.imageUrl}");'></div>
                            <div class="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">Active</div>
                        </div>
                        <div class="flex flex-col justify-center">
                            <div class="flex items-center gap-3">
                                <h1 id="player-name" class="text-white text-3xl font-black leading-tight tracking-tight">${defaultPlayer.name}</h1>
                                <span id="player-league" class="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">${defaultPlayer.league}</span>
                            </div>
                            <p id="player-meta" class="text-slate-400 text-lg font-medium mt-1">#${defaultPlayer.number} | ${defaultPlayer.position} | ${defaultPlayer.team}</p>
                            <div class="flex items-center gap-2 mt-2">
                                <span class="material-symbols-outlined text-sm text-emerald-500 animate-pulse">sync</span>
                                <p class="text-slate-500 text-xs font-bold uppercase tracking-wide">Updated 2 mins ago (Real-time Feed)</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-full max-w-[480px] gap-3 @[480px]:w-auto relative z-10">
                        <button class="flex items-center justify-center rounded-lg h-9 px-4 bg-slate-800 text-white text-xs font-bold transition-all hover:bg-slate-700 flex-1 @[480px]:flex-auto border border-white/5">
                            <span class="material-symbols-outlined mr-2 text-lg">person_add</span>
                            <span class="truncate">Follow</span>
                        </button>
                        <button class="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary-hover transition-all flex-1 @[480px]:flex-auto">
                            <span class="material-symbols-outlined mr-2 text-lg">download</span>
                            <span class="truncate">Export Stats</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div>
                <div class="flex flex-wrap items-center justify-between gap-3 px-2 mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Year</span>
                        <div class="relative">
                            <select id="season-select" class="form-select bg-slate-900 border border-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-2 pr-8">
                                ${initialYears.map((year) => `<option value="${year}">${year}</option>`).join('')}
                            </select>
                            <span class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">expand_more</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stat View</span>
                        <div id="viz-controls" class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button data-viz="bar" class="viz-button px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Bar</button>
                            <button data-viz="sparkline" class="viz-button px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Sparkline</button>
                            <button data-viz="delta" class="viz-button px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Delta</button>
                        </div>
                    </div>
                </div>
                <div id="primary-stats" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3"></div>
            </div>

            <!-- More Stats (Collapsible) -->
            <div class="bg-surface-dark border border-slate-800 rounded-xl p-4 shadow-card">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">stacked_bar_chart</span>
                        <h3 class="text-white text-lg font-black tracking-tight">More Stats</h3>
                    </div>
                    <button id="toggle-extra-stats" class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors" aria-expanded="false" aria-controls="extra-stats">
                        Show
                    </button>
                </div>
                <div id="extra-stats" class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 hidden"></div>
            </div>

            <!-- Recent Games & Splits -->
            <div class="space-y-4">
                <div class="flex items-center justify-between px-2">
                    <h3 class="text-white text-xl font-black tracking-tight">Recent Games</h3>
                    <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button data-tab="last10" class="recent-tab px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Last 10</button>
                        <button data-tab="season" class="recent-tab px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Season</button>
                        <button data-tab="postseason" class="recent-tab px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors">Post-Season</button>
                    </div>
                </div>

                <div class="overflow-hidden rounded-xl border border-slate-800 bg-surface-dark shadow-card">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-[#0B101B] text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                                <tr>
                                    <th class="px-6 py-4">Date</th>
                                    <th class="px-6 py-4">Opponent</th>
                                    <th class="px-6 py-4">Result</th>
                                    <th class="px-6 py-4">MIN</th>
                                    <th class="px-6 py-4 text-primary">PTS</th>
                                    <th class="px-6 py-4">REB</th>
                                    <th class="px-6 py-4">AST</th>
                                    <th class="px-6 py-4">FG%</th>
                                    <th class="px-6 py-4 text-right">+/-</th>
                                </tr>
                            </thead>
                            <tbody id="recent-games-body" class="divide-y divide-slate-800 text-sm font-medium"></tbody>
                        </table>
                    </div>
                    <div class="p-4 border-t border-slate-800 bg-[#0B101B] flex justify-between items-center">
                        <p id="recent-games-footer" class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Showing 0 of 0 games</p>
                        <button class="text-[10px] font-bold text-primary hover:text-white uppercase tracking-wider transition-colors">View Full Game Log</button>
                    </div>
                </div>
            </div>

            <!-- Splits Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Venue Splits -->
                <div class="space-y-4">
                    <h3 class="text-white text-lg font-black tracking-tight px-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">location_on</span>
                        Venue Splits
                    </h3>
                    <div class="bg-surface-dark rounded-xl border border-slate-800 p-6 shadow-card">
                        <div class="space-y-6">
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <span class="text-slate-400">Home Efficiency</span>
                                    <span class="text-primary">27.4 PPG</span>
                                </div>
                                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div class="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <span class="text-slate-400">Away Efficiency</span>
                                    <span class="text-slate-500">23.9 PPG</span>
                                </div>
                                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div class="bg-slate-600 h-full w-[70%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rest Patterns -->
                <div class="space-y-4">
                    <h3 class="text-white text-lg font-black tracking-tight px-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">schedule</span>
                        Rest Patterns
                    </h3>
                    <div class="bg-surface-dark rounded-xl border border-slate-800 p-6 shadow-card">
                         <div class="space-y-6">
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <span class="text-slate-400">0 Days Rest</span>
                                    <span class="text-orange-400">20.1 PPG</span>
                                </div>
                                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div class="bg-orange-400 h-full w-[55%] rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                                    <span class="text-slate-400">2+ Days Rest</span>
                                    <span class="text-emerald-500">28.5 PPG</span>
                                </div>
                                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div class="bg-emerald-500 h-full w-[90%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- The Launchpad -->
            <div class="relative group">
                <h2 class="text-white text-xl font-black tracking-tight mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">rocket_launch</span>
                    The Launchpad
                </h2>
                <div class="flex items-center gap-3 @container bg-surface-dark p-1.5 rounded-xl border border-primary/20 focus-within:border-primary transition-all shadow-glow-sm">
                    <div class="flex flex-1 flex-col">
                        <div class="flex flex-1 items-stretch">
                            <div class="flex items-center pl-4 pr-2">
                                <div id="launchpad-avatar" class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 shrink-0 shadow-sm ring-1 ring-white/10" style='background-image: url("${defaultPlayer.imageUrl}");'></div>
                            </div>
                            <div class="flex flex-1 flex-col">
                                <textarea id="launchpad-input" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-transparent border-none text-white focus:ring-0 text-lg font-medium leading-normal py-4 placeholder:text-slate-500" placeholder="Ask a question about ${defaultPlayer.name}... (e.g. 'Performance on 0 days rest vs. 2+ days?')"></textarea>
                                <div class="flex items-center justify-between px-4 pb-4">
                                    <div class="flex items-center gap-1">
                                        <button class="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                                            <span class="material-symbols-outlined">mic</span>
                                        </button>
                                        <button class="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                                            <span class="material-symbols-outlined">attach_file</span>
                                        </button>
                                        <button class="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-primary transition-colors">
                                            <span class="material-symbols-outlined">magic_button</span>
                                        </button>
                                    </div>
                                    <button class="min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all uppercase tracking-wide">
                                        Analyze Query
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-4 px-2">
                    <span class="text-xs text-slate-500 font-bold uppercase tracking-wider py-1">Try:</span>
                    <button class="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/30">Efficiency vs 4th Quarter Defenses</button>
                    <button class="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/30">Shot chart @ Away games</button>
                    <button class="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/30">Correlation: AD presence vs Rebounds</button>
                </div>
            </div>

            <!-- Query Results -->
            <div class="bg-surface-dark border border-slate-800 rounded-xl p-5 shadow-card">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">insights</span>
                        <h3 class="text-white text-lg font-black tracking-tight">Query Results</h3>
                    </div>
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mock Results</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${mockQueryResults.map((result) => `
                        <div class="rounded-xl border border-slate-800 bg-[#0B101B] p-4 hover:border-primary/40 transition-colors">
                            <div class="flex items-center justify-between">
                                <p class="text-white font-bold text-sm">${result.title}</p>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${result.confidence}</span>
                            </div>
                            <p class="text-slate-400 text-xs mt-2 leading-relaxed">${result.summary}</p>
                            <span class="inline-flex mt-3 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">${result.tag}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    const leagueSelect = document.getElementById('league-select');
    const playerInput = document.getElementById('player-input');
    const playerDropdown = document.getElementById('player-dropdown');
    const applyButton = document.getElementById('player-apply');
    const feedback = document.getElementById('player-feedback');
    const playerName = document.getElementById('player-name');
    const playerLeague = document.getElementById('player-league');
    const playerMeta = document.getElementById('player-meta');
    const playerAvatar = document.getElementById('player-avatar');
    const launchpadAvatar = document.getElementById('launchpad-avatar');
    const launchpadInput = document.getElementById('launchpad-input');
    const primaryStats = document.getElementById('primary-stats');
    const extraStats = document.getElementById('extra-stats');
    const toggleExtraStats = document.getElementById('toggle-extra-stats');

    const vizButtons = Array.from(document.querySelectorAll('.viz-button'));
    const recentTabButtons = Array.from(document.querySelectorAll('.recent-tab'));
    const recentGamesBody = document.getElementById('recent-games-body');
    const recentGamesFooter = document.getElementById('recent-games-footer');
    const seasonSelect = document.getElementById('season-select');
    let activeRecentTab = 'last10';

    const buildTrend = (baseValue) => {
        if (baseValue === null) return null;
        const steps = [0.92, 0.96, 0.99, 1.02, 0.98, 1.04, 1];
        return steps.map((multiplier) => Number((baseValue * multiplier).toFixed(2)));
    };

    const getStatMeta = (stat, index, total = 120) => {
        const valueNumber = parseNumber(stat.value);
        const avgValue = stat.avg ?? (valueNumber !== null ? Number((valueNumber * 0.92).toFixed(2)) : null);
        const rankValue = stat.rank ?? `${Math.min(index + 7, total)}/${total}`;
        const trendValue = stat.trend ?? buildTrend(valueNumber);
        return { valueNumber, avgValue, rankValue, trendValue };
    };

    const buildDelta = (value, avg) => {
        if (value === null || avg === null || avg === 0) return null;
        const deltaValue = ((value - avg) / avg) * 100;
        return {
            value: deltaValue,
            text: `${deltaValue >= 0 ? '+' : ''}${deltaValue.toFixed(1)}%`
        };
    };

    const renderBar = (value, avg, delta) => {
        if (value === null || avg === null) {
            return '<span class="text-[10px] text-slate-500">No avg</span>';
        }
        const maxValue = Math.max(Math.abs(value), Math.abs(avg), 1);
        const playerWidth = (Math.abs(value) / maxValue) * 100;
        const avgWidth = (Math.abs(avg) / maxValue) * 100;
        const deltaClass = delta && delta.value >= 0 ? 'text-emerald-400' : 'text-orange-400';
        const deltaText = delta ? delta.text : '--';

        return `
            <div class="flex items-center gap-2">
                <div class="flex-1 space-y-1">
                    <div class="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div class="h-full bg-primary/70" style="width: ${playerWidth}%;"></div>
                    </div>
                    <div class="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-slate-500" style="width: ${avgWidth}%;"></div>
                    </div>
                </div>
                <span class="text-[10px] font-bold ${deltaClass}">${deltaText}</span>
            </div>
        `;
    };

    const renderSparkline = (trend, delta) => {
        if (!trend || trend.length < 2) {
            return '<span class="text-[10px] text-slate-500">No trend</span>';
        }
        const width = 72;
        const height = 20;
        const min = Math.min(...trend);
        const max = Math.max(...trend);
        const range = max - min || 1;
        const points = trend
            .map((value, index) => {
                const x = (index / (trend.length - 1)) * width;
                const y = height - ((value - min) / range) * height;
                return `${x},${y}`;
            })
            .join(' ');
        const deltaClass = delta && delta.value >= 0 ? 'text-emerald-400' : 'text-orange-400';
        const deltaText = delta ? delta.text : '--';

        return `
            <div class="flex items-center gap-2">
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" aria-hidden="true">
                    <polyline points="${points}" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-[10px] font-bold ${deltaClass}">${deltaText}</span>
            </div>
        `;
    };

    const renderDeltaBadge = (delta) => {
        if (!delta) {
            return '<span class="text-[10px] text-slate-500">--</span>';
        }
        const deltaClass = delta.value >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-orange-400 bg-orange-400/10';
        return `<span class="text-[10px] font-bold px-2 py-1 rounded-full ${deltaClass}">${delta.text}</span>`;
    };

    const renderVisualization = (stat, index, variant) => {
        const totalRank = variant === 'primary' ? 120 : 200;
        const { valueNumber, avgValue, rankValue, trendValue } = getStatMeta(stat, index, totalRank);
        const delta = buildDelta(valueNumber, avgValue);

        if (selectedVisualization === 'sparkline') {
            return renderSparkline(trendValue, delta);
        }

        if (selectedVisualization === 'delta') {
            return renderDeltaBadge(delta);
        }

        return renderBar(valueNumber, avgValue, delta);
    };

    const renderStats = (stats, container, variant = 'primary') => {
        const cardClass = variant === 'primary'
            ? 'flex flex-col gap-2 rounded-xl p-4 bg-surface-dark border border-slate-800 shadow-card hover:border-primary/50 transition-colors'
            : 'flex flex-col gap-2 rounded-lg p-3 bg-[#0B101B] border border-slate-800';
        const labelClass = variant === 'primary'
            ? 'text-slate-400 text-[10px] font-bold uppercase tracking-widest'
            : 'text-slate-500 text-[10px] font-bold uppercase tracking-widest';
        const valueClass = variant === 'primary'
            ? 'text-white tracking-tight text-2xl font-black leading-tight'
            : 'text-white text-lg font-bold';

        container.innerHTML = stats
            .map((stat, index) => {
                const { rankValue } = getStatMeta(stat, index, variant === 'primary' ? 120 : 200);
                return `
                    <div class="${cardClass}">
                        <p class="${labelClass}">${stat.label}</p>
                        <div class="flex items-center justify-between gap-2">
                            <p class="${valueClass}">${stat.value}</p>
                            <span class="text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded-full">Rank ${rankValue}</span>
                        </div>
                        ${renderVisualization(stat, index, variant)}
                    </div>
                `;
            })
            .join('');
    };

    const resetExtraStats = () => {
        extraStats.classList.add('hidden');
        toggleExtraStats.textContent = 'Show';
        toggleExtraStats.setAttribute('aria-expanded', 'false');
    };

    const updateVisualizationControls = () => {
        const allowed = ['bar', 'sparkline', 'delta'];
        if (!allowed.includes(selectedVisualization)) {
            selectedVisualization = 'bar';
            localStorage.setItem(visualizationPreferenceKey, selectedVisualization);
        }

        vizButtons.forEach((button) => {
            const isActive = button.dataset.viz === selectedVisualization;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-slate-500', !isActive);
            button.classList.toggle('hover:text-white', !isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const renderRecentGames = (games) => {
        recentGamesBody.innerHTML = games
            .map((game) => {
                const isWin = game.result.trim().startsWith('W');
                const resultParts = game.result.split(' ');
                const resultLabel = resultParts[0];
                const resultScore = resultParts.slice(1).join(' ');
                const resultClass = isWin ? 'text-emerald-500' : 'text-red-500';
                const plusClass = String(game.plusMinus).startsWith('-') ? 'text-red-500' : 'text-emerald-500';
                return `
                    <tr class="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td class="px-6 py-4 text-slate-400">${game.date}</td>
                        <td class="px-6 py-4 flex items-center gap-2 text-white">
                            <div class="size-6 bg-slate-700 rounded-full"></div>
                            ${game.opponent}
                        </td>
                        <td class="px-6 py-4 text-slate-300"><span class="${resultClass} font-bold">${resultLabel}</span> ${resultScore}</td>
                        <td class="px-6 py-4 text-slate-300">${game.min}</td>
                        <td class="px-6 py-4 font-black text-white text-lg">${game.pts}</td>
                        <td class="px-6 py-4 text-slate-300">${game.reb}</td>
                        <td class="px-6 py-4 text-slate-300">${game.ast}</td>
                        <td class="px-6 py-4 text-slate-300">${game.fgPct}</td>
                        <td class="px-6 py-4 text-right font-black ${plusClass}">${game.plusMinus}</td>
                    </tr>
                `;
            })
            .join('');
        recentGamesFooter.textContent = `Showing ${games.length} of ${games.length} games`;
    };

    const updateRecentTabs = () => {
        const isCurrent = isCurrentSeason();
        recentTabButtons.forEach((button) => {
            const tabKey = button.dataset.tab;
            const isDisabled = !isCurrent && tabKey !== 'last10';
            button.classList.toggle('cursor-not-allowed', isDisabled);
            button.classList.toggle('opacity-50', isDisabled);
            button.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
            button.disabled = isDisabled;
        });
        recentTabButtons.forEach((button) => {
            const isActive = button.dataset.tab === activeRecentTab;
            button.classList.toggle('bg-primary', isActive);
            button.classList.toggle('text-white', isActive);
            button.classList.toggle('shadow-sm', isActive);
            button.classList.toggle('text-slate-500', !isActive);
            button.classList.toggle('hover:text-white', !isActive);
        });
    };

    const loadRecentGames = (player) => {
        if (!isCurrentSeason()) {
            activeRecentTab = 'last10';
        }
        const seasonData = getSeasonData(player);
        const games = seasonData.recentGames?.[activeRecentTab] || [];
        renderRecentGames(games);
        updateRecentTabs();
    };

    const getActiveYears = (player) => {
        const start = player.activeStartYear ?? player.activeEndYear;
        const end = player.activeEndYear ?? player.activeStartYear;
        const years = [];
        if (!start || !end) return years;
        for (let year = start; year <= end; year += 1) {
            years.push(year);
        }
        return years;
    };

    const setActiveSeasonYear = (player, year) => {
        const years = getActiveYears(player);
        if (!years.length) {
            activeSeasonYear = player.activeEndYear || new Date().getFullYear();
            return;
        }
        if (years.includes(year)) {
            activeSeasonYear = year;
            return;
        }
        activeSeasonYear = years[years.length - 1];
    };

    const isCurrentSeason = () => activeSeasonYear === activePlayer.activeEndYear;

    const getSeasonData = (player) => {
        if (player.seasons && player.seasons[activeSeasonYear]) {
            return player.seasons[activeSeasonYear];
        }
        return {
            primaryStats: player.primaryStats,
            extraStats: player.extraStats,
            recentGames: player.recentGames
        };
    };

    const renderSeasonControls = (player) => {
        const years = getActiveYears(player);
        seasonSelect.innerHTML = years
            .map((year) => `<option value="${year}">${year}</option>`)
            .join('');
        seasonSelect.value = String(activeSeasonYear);
        seasonSelect.disabled = years.length === 0;
    };

    const renderAllStats = (player) => {
        const seasonData = getSeasonData(player);
        renderStats(seasonData.primaryStats, primaryStats, 'primary');
        renderStats(seasonData.extraStats, extraStats, 'extra');
    };

    let availablePlayers = [];
    let filteredPlayers = [];
    let highlightedIndex = -1;

    const closePlayerDropdown = () => {
        playerDropdown.classList.add('hidden');
        playerInput.setAttribute('aria-expanded', 'false');
        highlightedIndex = -1;
    };

    const openPlayerDropdown = () => {
        if (!filteredPlayers.length) {
            closePlayerDropdown();
            return;
        }
        playerDropdown.classList.remove('hidden');
        playerInput.setAttribute('aria-expanded', 'true');
    };

    const renderPlayerDropdown = () => {
        playerDropdown.innerHTML = filteredPlayers
            .map((player, index) => {
                const isActive = index === highlightedIndex;
                return `
                    <button type="button" role="option" aria-selected="${isActive ? 'true' : 'false'}"
                        data-player="${player.name}"
                        class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${isActive ? 'bg-primary/15 text-white' : 'text-slate-200 hover:bg-white/5'}">
                        <div>
                            <p class="font-semibold">${player.name}</p>
                            <p class="text-[10px] text-slate-400 uppercase tracking-wider">${player.team}</p>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-1 rounded-full">${player.league}</span>
                    </button>
                `;
            })
            .join('');
        openPlayerDropdown();
    };

    const updateSuggestions = (league) => {
        availablePlayers = [];
        filteredPlayers = [];
        playerInput.value = '';
        highlightedIndex = -1;
        if (!league) {
            playerInput.setAttribute('placeholder', 'Select a league first...');
            playerInput.setAttribute('disabled', 'true');
            closePlayerDropdown();
            return;
        }
        playerInput.removeAttribute('disabled');
        playerInput.setAttribute('placeholder', 'Start typing a player name...');
        availablePlayers = playerDirectory.filter((player) => player.league === league);
        filteredPlayers = availablePlayers;
        renderPlayerDropdown();
    };

    const filterPlayers = (query) => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            filteredPlayers = availablePlayers;
            highlightedIndex = -1;
            renderPlayerDropdown();
            return;
        }
        filteredPlayers = availablePlayers.filter((player) => player.name.toLowerCase().includes(normalized));
        highlightedIndex = filteredPlayers.length ? 0 : -1;
        renderPlayerDropdown();
    };

    const selectPlayer = (playerName) => {
        playerInput.value = playerName;
        closePlayerDropdown();
        playerInput.focus();
    };

    setActiveSeasonYear(activePlayer, activeSeasonYear);
    updateVisualizationControls();
    renderSeasonControls(activePlayer);
    updateSuggestions(leagueSelect.value);
    renderAllStats(activePlayer);
    resetExtraStats();
    loadRecentGames(activePlayer);

    const setFeedback = (message = '') => {
        if (!message) {
            feedback.textContent = '';
            feedback.classList.add('hidden');
            return;
        }
        feedback.textContent = message;
        feedback.classList.remove('hidden');
    };

    const applyPlayerSelection = () => {
        const selectedLeague = leagueSelect.value.trim();
        const selectedPlayer = playerInput.value.trim().toLowerCase();

        if (!selectedLeague) {
            setFeedback('Select a league to narrow player results.');
            return;
        }

        if (!selectedPlayer) {
            setFeedback('Select a player from the list.');
            return;
        }

        const match = playerDirectory.find((player) => {
            return player.league === selectedLeague && player.name.toLowerCase() === selectedPlayer;
        }) || playerDirectory.find((player) => {
            return player.league === selectedLeague && player.name.toLowerCase().includes(selectedPlayer);
        });

        if (!match) {
            setFeedback('No matching player found in the selected league.');
            return;
        }

        setFeedback('');
        activePlayer = match;
        setActiveSeasonYear(activePlayer, activeSeasonYear);
        playerName.textContent = match.name;
        playerLeague.textContent = match.league;
        playerMeta.textContent = `#${match.number} | ${match.position} | ${match.team}`;
        playerAvatar.style.backgroundImage = `url("${match.imageUrl}")`;
        launchpadAvatar.style.backgroundImage = `url("${match.imageUrl}")`;
        launchpadInput.setAttribute('placeholder', `Ask a question about ${match.name}... (e.g. 'Performance on 0 days rest vs. 2+ days?')`);
        renderSeasonControls(activePlayer);
        renderAllStats(activePlayer);
        loadRecentGames(activePlayer);
        resetExtraStats();
    };

    leagueSelect.addEventListener('change', () => {
        updateSuggestions(leagueSelect.value);
        setFeedback('');
    });

    playerInput.addEventListener('input', (event) => {
        if (playerInput.disabled) return;
        filterPlayers(event.target.value);
    });

    playerInput.addEventListener('focus', () => {
        if (playerInput.disabled) return;
        filteredPlayers = availablePlayers;
        renderPlayerDropdown();
    });

    playerInput.addEventListener('keydown', (event) => {
        if (playerInput.disabled) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!filteredPlayers.length) return;
            highlightedIndex = (highlightedIndex + 1) % filteredPlayers.length;
            renderPlayerDropdown();
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!filteredPlayers.length) return;
            highlightedIndex = (highlightedIndex - 1 + filteredPlayers.length) % filteredPlayers.length;
            renderPlayerDropdown();
            return;
        }
        if (event.key === 'Enter') {
            if (filteredPlayers.length && highlightedIndex >= 0) {
                event.preventDefault();
                selectPlayer(filteredPlayers[highlightedIndex].name);
                return;
            }
        }
        if (event.key === 'Escape') {
            closePlayerDropdown();
        }
    });

    playerDropdown.addEventListener('click', (event) => {
        const target = event.target.closest('[data-player]');
        if (!target) return;
        selectPlayer(target.dataset.player);
    });

    document.addEventListener('click', (event) => {
        if (!playerDropdown.contains(event.target) && event.target !== playerInput) {
            closePlayerDropdown();
        }
    });

    applyButton.addEventListener('click', applyPlayerSelection);

    vizButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextValue = button.dataset.viz;
            if (!nextValue) return;
            selectedVisualization = nextValue;
            localStorage.setItem(visualizationPreferenceKey, selectedVisualization);
            updateVisualizationControls();
            renderAllStats(activePlayer);
            resetExtraStats();
        });
    });

    recentTabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            activeRecentTab = button.dataset.tab;
            loadRecentGames(activePlayer);
        });
    });

    seasonSelect.addEventListener('change', () => {
        const nextYear = Number(seasonSelect.value);
        if (!nextYear) return;
        setActiveSeasonYear(activePlayer, nextYear);
        renderAllStats(activePlayer);
        loadRecentGames(activePlayer);
        resetExtraStats();
    });

    toggleExtraStats.addEventListener('click', () => {
        const isHidden = extraStats.classList.contains('hidden');
        extraStats.classList.toggle('hidden');
        toggleExtraStats.textContent = isHidden ? 'Hide' : 'Show';
        toggleExtraStats.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
}

// Export for router
window.renderPlayerPage = renderPlayerPage;

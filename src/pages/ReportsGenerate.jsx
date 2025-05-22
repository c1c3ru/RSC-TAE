// src/pages/ReportsGenerate.jsx
import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, CircularProgress, MenuItem, Box } from '@mui/material';
import { useCompetency } from '../context/CompetencyContext'; // Import useCompetency hook
import { format } from 'date-fns'; // For date formatting

const ReportsGenerate = () => {
    const { activities, competencyItems, totalScore, categoryScores } = useCompetency(); // Access data from context
    
    const [reportType, setReportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportContent, setReportContent] = useState(null); // Renamed reportData to reportContent for clarity
    const [error, setError] = useState('');

    const handleGenerateReport = async () => {
        setLoading(true);
        setError('');
        setReportContent(null);

        if (!reportType) {
            setError('Por favor, selecione um tipo de relatório.');
            setLoading(false);
            return;
        }

        try {
            // Simulate API call for report generation
            await new Promise((resolve) => setTimeout(resolve, 1500));

            let generatedReport = {};

            switch (reportType) {
                case 'category_score_distribution':
                    generatedReport = {
                        title: 'Distribuição de Pontuação por Categoria',
                        data: categoryScores.map((score, index) => ({
                            category: categories[index]?.name || `Categoria ${index + 1}`,
                            score: score.toFixed(1)
                        }))
                    };
                    break;
                case 'activity_summary_by_period':
                    // Filter activities by date range if provided
                    const filtered = activities.filter(activity => {
                        const activityDate = new Date(activity.dataRegistro);
                        const start = startDate ? new Date(startDate) : null;
                        const end = endDate ? new Date(endDate) : null;

                        if (start && activityDate < start) return false;
                        if (end && activityDate > end) return false;
                        return true;
                    });

                    generatedReport = {
                        title: 'Resumo de Atividades por Período',
                        totalActivities: filtered.length,
                        totalPoints: filtered.reduce((sum, act) => sum + act.pontuacao, 0).toFixed(1),
                        activities: filtered.map(act => ({
                            item: competencyItems.find(item => item.id === act.itemCompetenciaId)?.titulo || 'N/A',
                            description: act.descricao,
                            points: act.pontuacao.toFixed(1),
                            status: act.status
                        }))
                    };
                    break;
                // Add more report types as needed
                default:
                    generatedReport = {
                        title: `Relatório de ${reportType}`,
                        content: `Dados para o relatório "${reportType}" seriam processados aqui.`,
                    };
                    break;
            }

            setReportContent({
                type: reportType,
                generatedAt: new Date().toLocaleString('pt-BR'),
                data: generatedReport,
            });

        } catch (err) {
            console.error("Error generating report:", err);
            setError('Erro ao gerar relatório. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Example categories (from Sidebar or CompetencyContext)
    const categories = [
        { id: 1, name: 'Atividades Administrativas' },
        { id: 2, name: 'Experiência Profissional' },
        { id: 3, name: 'Formação e Capacitação' },
        { id: 4, name: 'Produção Científica' },
        { id: 5, name: 'Participação em Eventos' },
        { id: 6, name: 'Atividades de Ensino' }
    ];

    return (
        <Paper sx={{ p: 4, maxWidth: 800, margin: '40px auto' }}>
            <Typography variant="h5" gutterBottom>
                Gerar Relatório
            </Typography>
            <TextField
                select
                label="Tipo de Relatório"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                fullWidth
                margin="normal"
            >
                <MenuItem value="">Selecione um tipo de relatório</MenuItem>
                <MenuItem value="category_score_distribution">Distribuição de Pontuação por Categoria</MenuItem>
                <MenuItem value="activity_summary_by_period">Resumo de Atividades por Período</MenuItem>
                {/* Add more report types here */}
            </TextField>

            {reportType === 'activity_summary_by_period' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                        label="Data Inicial"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <TextField
                        label="Data Final"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Box>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={loading || !reportType}
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Gerar'}
            </Button>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            {reportContent && (
                <Paper sx={{ mt: 4, p: 2, background: '#f5f5f5' }}>
                    <Typography variant="h6" gutterBottom>
                        {reportContent.data.title}
                    </Typography>
                    {reportContent.type === 'category_score_distribution' && (
                        <Box>
                            {reportContent.data.data.map((item, index) => (
                                <Typography key={index} variant="body1">
                                    {item.category}: {item.score} pontos
                                </Typography>
                            ))}
                        </Box>
                    )}
                    {reportContent.type === 'activity_summary_by_period' && (
                        <Box>
                            <Typography variant="body1">Total de Atividades: {reportContent.data.totalActivities}</Typography>
                            <Typography variant="body1">Total de Pontos Calculados: {reportContent.data.totalPoints}</Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>Detalhes das Atividades:</Typography>
                            {reportContent.data.activities.length > 0 ? (
                                <ul>
                                    {reportContent.data.activities.map((act, index) => (
                                        <li key={index}>
                                            {act.item} - {act.description} ({act.points} pontos) - Status: {act.status}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body2">Nenhuma atividade encontrada para o período/critério selecionado.</Typography>
                            )}
                        </Box>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        Gerado em: {reportContent.generatedAt}
                    </Typography>
                    {/* Add download button */}
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={() => alert('Download functionality to be implemented.')}>
                        Download Report
                    </Button>
                </Paper>
            )}
        </Paper>
    );
};

export default ReportsGenerate;
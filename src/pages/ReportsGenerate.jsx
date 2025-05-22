import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';

const ReportsGenerate = () => {
    const [reportType, setReportType] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setReportType(e.target.value);
    };

    const handleGenerateReport = async () => {
        setLoading(true);
        setError('');
        setReportData(null);
        try {
            // Simulação de chamada de API para gerar relatório
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setReportData({
                type: reportType,
                generatedAt: new Date().toLocaleString(),
                content: `Relatório do tipo "${reportType}" gerado com sucesso.`,
            });
        } catch (err) {
            setError('Erro ao gerar relatório. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 500, margin: '40px auto' }}>
            <Typography variant="h5" gutterBottom>
                Gerar Relatório
            </Typography>
            <TextField
                label="Tipo de Relatório"
                value={reportType}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={loading || !reportType}
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Gerar'}
            </Button>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            {reportData && (
                <Paper sx={{ mt: 4, p: 2, background: '#f5f5f5' }}>
                    <Typography variant="subtitle1">
                        {reportData.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Gerado em: {reportData.generatedAt}
                    </Typography>
                </Paper>
            )}
        </Paper>
    );
};

export default ReportsGenerate;
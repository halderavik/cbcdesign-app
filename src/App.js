import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  styled
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: '12px 24px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  '&:hover': {
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  },
}));

function App() {
  const [attributes, setAttributes] = useState([{ name: '', levels: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', levels: '' }]);
  };

  const handleRemoveAttribute = (index) => {
    if (attributes.length === 1) return;
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    const response = await fetch('https://szy47aqxi7.execute-api.us-east-1.amazonaws.com/Prod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes }),
    });
    const result = await response.json();
    alert(`Sample Size: ${result.sampleSize}. ${result.message}`);
  } catch (error) {
    alert('Error! Check the console.');
    console.error(error);
  }
};

    try {
      // Basic validation
      if (attributes.some(attr => !attr.name.trim() || !attr.levels.trim())) {
        throw new Error('Please fill all fields');
      }

      const response = await fetch('YOUR_API_GATEWAY_INVOKE_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes }),
      });

      if (!response.ok) throw new Error('Server error');
      
      const result = await response.json();
      if (result.downloadUrl) {
        window.location.href = result.downloadUrl;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          🚀 Conjoint Design Generator
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {attributes.map((attr, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8f9fa' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Attribute Name"
                        variant="outlined"
                        value={attr.name}
                        onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                        placeholder="e.g., Price"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Levels (comma-separated)"
                        variant="outlined"
                        value={attr.levels}
                        onChange={(e) => handleAttributeChange(index, 'levels', e.target.value)}
                        placeholder="e.g., $10, $20, $30"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                      <IconButton
                        onClick={() => handleRemoveAttribute(index)}
                        color="error"
                        disabled={attributes.length === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddAttribute}
                variant="outlined"
                color="primary"
                sx={{ borderRadius: '8px' }}
              >
                Add Attribute
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
              <GradientButton
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Generating...' : 'Generate Design'}
              </GradientButton>
            </Grid>
          </Grid>
        </form>

        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          💡 Tip: Add at least 2 attributes with 2+ levels each for optimal results
        </Typography>
      </StyledPaper>
    </Container>
  );
}

export default App;
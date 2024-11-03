import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
}));

function RecipeReviewCard({ mediaSrc, mediaType, description, tags }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <Box sx={{ height: 200, backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {mediaType === 'image' ? (
          <img src={mediaSrc} alt="Recipe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <video src={mediaSrc} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </Box>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function RecipeReviewCardList() {
  const cardsData = [
    {
      mediaSrc: '/assets/nyc.jpg',
      mediaType: 'image',
      description: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
      tags: ["Live", "Music", "Album"]
    },
    {
      mediaSrc: '/assets/tokyo.jpg',
      mediaType: 'image',
      description: 'A delightful pasta dish that combines fresh ingredients with a creamy sauce. Perfect for a family dinner or a small gathering.',
      tags: ["Pasta", "Dinner", "Italian"]
    },
    {
      mediaSrc: '/assets/city3.jpg',
      mediaType: 'image',
      description: 'Enjoy a refreshing and light summer salad with a mix of greens, fruits, and nuts. Great as a starter or a side dish.',
      tags: ["Salad", "Healthy", "Vegetarian"]
    },
    {
      mediaSrc: '/assets/gross-cat-battle-cats.mp4',
      mediaType: 'video',
      description: 'Watch this exciting and fun video of the Gross Cat from Battle Cats in action!',
      tags: ["Video", "Battle Cats", "Fun"]
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {cardsData.map((card, index) => (
        <RecipeReviewCard
          key={index}
          mediaSrc={card.mediaSrc}
          mediaType={card.mediaType}
          description={card.description}
          tags={card.tags}
        />
      ))}
    </Box>
  );
}

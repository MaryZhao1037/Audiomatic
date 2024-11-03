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
      description: 'New York City: where dreams are big, buildings are taller, and sleep is optional. From the neon dazzle of Times Square to the calm of Central Park, NYC is a concrete jungle that’s anything but tame.',
      tags: ["Arts & Culture", "Finance", "Night Life"]
    },
    {
      mediaSrc: '/assets/32-lake-louise.jpg',
      mediaType: 'image',
      description: 'Lake Louise: where the mountains are majestic, the water’s glacier-blue, and nature outshines any filter. Nestled in the Rockies, it’s Canada’s ultimate alpine postcard—stunningly cold and stunningly beautiful.',
      tags: ["Nature", "Lakes", "Wildlife"]
    },
    {
      mediaSrc: '/assets/understanding-abstract-art.jpg',
      mediaType: 'image',
      description: 'This abstract piece: where colors collide, shapes dance, and rules take a backseat. A splash of bold hues and energetic strokes—it is art that doesn’t tell you what to see, but dares you to feel.',
      tags: ["Abstract Art", "Color Theory", "Visual Energy"]
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

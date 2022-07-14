import { Grid, GridItem, Container, Box, Text, Center, Heading, Image } from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import styles from '../styles/Home.module.css';
import pic from '../public/ECHLogo.png';

import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const { user, isInitialized, Moralis } = useMoralis();
  
  useEffect(async () => {
    if (isInitialized) {
      // Query courses from Moralis
      await getCourses();
    }
  }, [isInitialized]);

  async function getCourses() {
    // This will need to be transitioned to a Cloud function when filtering between completed and not completed by user
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    const results = await query.map(course => {
      let thumbnailUrl
      if (course.attributes.videoUrl) {
        const startIndex = "https://www.youtube.com/embed/".length
        thumbnailUrl = `http://img.youtube.com/vi/${course.attributes.videoUrl.substring(startIndex)}/maxresdefault.jpg`
      }
      return {
        id: course.id,
        title: course.attributes.title,
        thumbnail: thumbnailUrl ? thumbnailUrl : pic,
        completed: false
      }
    });
    setCourses(results);
  }

  return (
    <Layout>
      <Container maxW='container.xl' paddingTop={5} paddingBottom={5}>
        {courses.length ?
          <NextLink href={`/courses/${courses[0].id}`}>
            <Center mb={10} borderRadius="2xl" width="100%" minHeight={250} border="1px solid grey" cursor="pointer" backgroundImage={courses[0].thumbnail} objectFit='cover' _hover={{ transition: 'all .5s ease', objectFit: 'fill' }}>
              <Heading size='xl' noOfLines={1}>{courses[0].title}</Heading>
            </Center>
          </NextLink>
          :
          ""
        }
        <Grid templateColumns={'repeat(auto-fit, minmax(200px, 1fr))'} gap={5}>
          {courses.slice(1).map((course, index) =>
            <NextLink href={`/courses/${course.id}`} key={index}>
              <GridItem bg="rgba(36, 39, 48, 1)" borderRadius='2xl' maxWidth='350px' minHeight='fit-content' border='1px solid grey' cursor='pointer' overflow='hidden'>
                <Image src={course.thumbnail} objectFit='cover' borderTopRadius='2xl' _hover={{ transition: 'transform .5s ease', transform: 'scale(1.2)' }} zIndex={0} />
                <Center padding={2} borderBottomRadius='2xl' height={100} zIndex={1} bg="rgba(36, 39, 48, 1)">
                  <Heading size='sm' noOfLines={3} textAlign='center'>{course.title}</Heading>
                </Center>
              </GridItem>
            </NextLink>
          )}
        </Grid>
      </Container>
    </Layout>
  )
}

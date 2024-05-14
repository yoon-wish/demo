import { Box, Button, HStack, Heading, Icon, IconButton, Input, Stack, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { MdOndemandVideo, MdRecommend } from "react-icons/md";
import { FaMoon } from "react-icons/fa6";
import { IoMdSunny } from "react-icons/io";

const VideoRecommend = () => {

    // useEffect가 어떻게 동작하는 지 State로 확인
    // useState 는 화면 랜더링에 반영됨 >> 그렇다고 이것만 쓰면 리랜더링의 장점 X
    // 그럴거면 뭐하러 리액트를 쓰냐함
    const [videoList, setVideoList] = useState([]);
    // 디폴트 값을 useState로 설정해주는거임
    const [page, setPage] = useState(1);

    // useRef 는 화면 랜더링 반영되지 않는 참조값
    const pageCount = useRef(1);

    const { colorMode, toggleColorMode } = useColorMode();
    const color = useColorModeValue("cyan", "cyan");
    const buttonScheme = useColorModeValue("blackAlpha", "whiteAlpha");
    
    const fetchBooks = async () => {
        const response = await fetch(
            `https://dapi.kakao.com/v2/search/vclip?query='라이즈'&page=${page}`,
            {
                method: "GET",
                headers: {
                    Authorization: `KakaoAK ${process.env.REACT_APP_API_KEY}`,
                },
            }
        );
        const data = await response.json();
        console.log(data);

        pageCount.current = data.meta.pageable_count % 10 > 0
            ? data.meta.pageable_count / 10 + 1
            : data.meta.pageable_count / 10;
        pageCount.current = Math.floor(pageCount.current);
        pageCount.current = pageCount.current > 15 ? 15 : pageCount.current;
        console.log(pageCount.current);

        setVideoList(data.documents);
    }

    useEffect(() => {
        fetchBooks();
    }, [page])

    return (
        <>
            <Box>
                <Heading color={color}>
                    <Icon as={MdOndemandVideo} boxSize={"1.5em"}></Icon>
                    동영상 추천 목록</Heading>
                {
                    colorMode === "light" ?
                        <IconButton icon={<FaMoon />} onClick={toggleColorMode} size={"lg"}/> :
                        <IconButton icon={<IoMdSunny />} onClick={toggleColorMode} size={"lg"}/>
                }

                <TableContainer>
                    <Table variant={"striped"} colorScheme="gray">
                        <Thead>
                            <Tr>
                                <Th>No</Th>
                                <Th>Title</Th>
                                <Th>Author</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {videoList.map((video, index) => {
                                return (
                                    <>
                                        <Tr>
                                            <Td>{(page - 1) * 10 + index + 1}</Td>
                                            <Td>
                                                <a href={video.url}>{video.title}</a>
                                            </Td>
                                            <Td>{video.author}</Td>
                                        </Tr>
                                    </>
                                )
                            })}
                        </Tbody>
                        <Tfoot>

                        </Tfoot>
                    </Table>
                </TableContainer>
                <HStack>
                    {Array.from({ length: pageCount.current }, (_, index) => (
                        <>

                            <Button colorScheme={page === index + 1 ? "cyan" : buttonScheme}
                                onClick={e => { setPage(index + 1) }}>{index + 1}
                            </Button>
                        </>
                    ))}
                </HStack>
            </Box>
        </>
    );
};

export default VideoRecommend;
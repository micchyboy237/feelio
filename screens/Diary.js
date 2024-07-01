import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import DiaryTopBar from '../components/DiaryTopBar'
import { getDiary } from '../constants/Database'
import useStyles from '../constants/styles'
import { DContexts } from '../contexts/DContexts'
export default function Diary() {
  const navigation = useNavigation()
  const route = useRoute()
  const diaryid = route.params.id
  console.log('Diary:', diaryid)
  const [diary, setDiary] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [day, setDay] = useState(null)
  const [month, setMonth] = useState(null)
  const [year, setYear] = useState(null)

  const { changedsomething } = useContext(DContexts)
  const { setChangedSomething } = useContext(DContexts)

  css = useStyles()
  useEffect(() => {
    getDiary(diaryid)
      .then((data) => {
        if (data) {
          setTitle(data.title)
          setContent(data.content)
          setDay(data.day)
          setMonth(data.monthname)
          setYear(data.year)
          setDiary(data)
        }
      })
      .catch((error) => {
        console.error('Failed to get diaries:', error)
      })
  }, [changedsomething])

  const goToEdit = (did) => {
    navigation.navigate('Edit', { id: did })
  }
  return (
    <ScrollView style={css.container}>
      <SafeAreaView>
        <DiaryTopBar acton={() => goToEdit(diaryid)} diaryid={diaryid} />
        <View style={{ margin: 15 }}>
          <Text style={css.greytext}>
            {day}, {month} {year}
          </Text>
          <Text style={{ ...css.txt, ...styles.title }}>{title}</Text>
          <Text style={{ ...css.txt, ...styles.content }}>{content}</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  title: {
    margin: 10,
    marginLeft: 0,
    marginTop: 1,
    padding: 5,
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    fontSize: 16,
    lineHeight: 16,
    margin: 5,
  },
})

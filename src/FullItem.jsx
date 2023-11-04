/* eslint-disable no-inner-declarations */
import { useEffect, useState } from "react"
import { pb } from "./pocketbase"
import _, { map } from 'lodash'
import useSWR from 'swr'

const fetcher = async () => {
    try {
        const result = await pb.collection('Candidates').getFullList({
            expand: "Scores(candidate), Scores(candidate).judge"
        })
        function query(data) {
            return _.chain(data)
                .map(item => ({
                    "Name": item?.Name,
                    "id": item?.id,
                    "nameId": item?.nameId,
                    "Scores(candidate)": item?.expand?.["Scores(candidate)"]
                }))
                .value()
        }

        const res = await query(result)
        return res
    } catch (err) {
        console.log(err)
    }
}

function FullResult() {
    const { data, isLoading, error } = useSWR('Candidates', fetcher)

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    return (
        <div>
            <div onClick={() => console.log(data)}>Logger</div>
            <div className="flex gap-5 justify-evenly">
                <h3>nameId</h3>
                <h1>Name</h1>
                <h4>Scores(candidate)</h4>
            </div>
            {/* {data.map((item, index) => (
                <div className="flex gap-5 justify-evenly" key={index}>
                    <h3>{item.nameId}</h3>
                    <h1>{item.Name}</h1>
                    <h3 className="flex flex-col">{item["Scores(candidate)"].sort((a, b) => {
                        const aScore = item["Scores(candidate)"][a]
                        const bScore = item["Scores(candidate)"][b]
                        return bScore - aScore
                    }).map((score, i) => (
                        <span key={i}>
                            {score.score}
                        </span>
                    ))}</h3>
                </div>
            ))} */}
            {data.map((item, index) => (
                <div className="flex gap-5 justify-evenly" key={index}>
                    <h3>{item.nameId}</h3>
                    <h1>{item.Name}</h1>
                    <h3 className="flex flex-col">{item["Scores(candidate)"].sort((a, b) => {
                        const aScore = item["Scores(candidate)"][a]
                        const bScore = item["Scores(candidate)"][b]
                        return bScore - aScore
                    }).map((ite) => (
                        <span key={ite.id}>
                            {ite.judge.Name}: {ite.score}
                        </span>

                    ))}</h3>
                </div>
            ))}
        </div>
    )
}

export default FullResult
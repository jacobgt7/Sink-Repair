import { getRequests, deleteRequest, saveCompletion, getCompletions, getPlumbers } from "./dataAccess.js"

const mainContainer = document.querySelector("#container")

mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [, requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})

mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")

            /*
                This object should have 3 properties
                   1. requestId
                   2. plumberId
                   3. date_created
            */
            const completion = {
                requestId: parseInt(requestId),
                plumberId: plumberId,
                dateCreated: Date.now()
            }

            /*
                Invoke the function that performs the POST request
                to the `completions` resource for your API. Send the
                completion object as a parameter.
             */
            saveCompletion(completion)



        }
    }
)

export const Requests = () => {
    const requests = getRequests()
    const plumbers = getPlumbers()
    const completions = getCompletions()

    const pendingRequests = () => {
        let pendingArray = []
        requests.forEach(request => {
            let mathcingCompletion = completions.find(completion => completion.requestId === request.id)
            if (!mathcingCompletion) {
                pendingArray.push(request)
            }
        })
        return pendingArray
    }

    const completedRequests = () => {
        let completedArray = []
        requests.forEach(request => {
            let mathcingCompletion = completions.find(completion => completion.requestId === request.id)
            if (mathcingCompletion) {
                completedArray.push(request)
            }
        })
        return completedArray
    }



    let html = `
        <ul>
        ${pendingRequests().map(
        request => `
        <li>
            ${request.description}
            <select class="plumbers" id="plumbers">
                <option value="">Choose</option>
                     ${plumbers.map(
            plumber => `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
        ).join("")
            }
</select>
            <button class= "request__delete" id ="request--${request.id}">Delete</button>
        </li> `
    ).join("")
        }

        ${completedRequests().map(request =>
            `<li class="completed">
                    ${request.description}
                    <button class="request__delete" id="request--${request.id}">Delete</button>
        </li>`
        ).join("")

        }
        </ul>
    `

    return html
}
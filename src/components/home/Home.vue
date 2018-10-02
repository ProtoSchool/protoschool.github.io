<template>
  <div class="home">
    <header class="flex items-center bg-navy white pv3">
      <div class="flex-none">
        <div class="ph2 ph4-ns">
          <img src="./ipfs-logo.svg" alt="IPFS" style="height: 66px" />
        </div>
        <div class="header-text indent-1">
          <h1 class="ma0 pt4 ttu fw4">
            <span class="green">Proto</span>
            <span class="white">school</span>
          </h1>
          <h2 class="ma0 fw5">
            The interactive IPFS protocol workshop
          </h2>
        </div>
      </div>
      <div class="flex-auto tc">
        <img src="./ipfs-illustrations-how-3.svg" alt="" style="height: 124px;"/>
      </div>
    </header>
    <section class="db bt border-aqua bw4">
      <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
        <strong>Protoschool is a collection of workshops</strong> that help you learn about the
        IPFS protocol by writing code and solving challenges.
      </p>
    </section>
    <section class="db bt border-aqua bw4 relative">
      <label class="absolute ttu f6 fw5 white" style="top: -15px; left: 91px;">
        TOPICS
      </label>
      <div class="flex items-start pv4">
        <div class="section-1 flex-none tc">
          <h1 class="ma0 f3 fw6 pb2">IPLD</h1>
          <img src="./ipld.svg" alt="" style="height: 54px"/>
        </div>
        <div class="w-100 w-50-ns measure-wide ph2 ph0-ns">
          <h2 class="ma0 f3 fw5">Learn Decentralized Data-Structures</h2>
          <p class="f5 fw5 ma0 pt2 lh-copy measure-wide charcoal-muted">
            Long Desc
          </p>
          <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
            <li>
              <ExerciseLink to="/data-structures/01" index="1" name="Hashing." />
            </li>
            <li>
              <ExerciseLink to="/data-structures/02" index="2" name="Content Addressing." />
            </li>
            <li>
              <ExerciseLink to="/data-structures/03" index="3" name="Merkle Trees." />
            </li>
          </ul>
        </div>
        <div class="dn db-ns flex-auto tc">
          <img src="./ipfs-illustrations-how-4.svg" alt="">
        </div>
      </div>
    </section>
    <section class="db">
      <div class="flex items-start pv4">
        <div class="section-1 flex-none tc">
          <h1 class="ma0 f3 fw6 pb2">IPLD</h1>
          <img src="./ipld.svg" alt="" style="height: 54px"/>
        </div>
        <div class="w-100 w-50-ns measure-wide ph2 ph0-ns">
          <h2 class="ma0 f3 fw5">P2P data links with content addressing</h2>
          <p class="f5 fw5 ma0 pt2 lh-copy measure-wide charcoal-muted">
            Store, fetch, and create verifiable links between peer-hosted datasets with IPLD and CIDs. It’s graphs with friends!
          </p>
          <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
            <li>
              <ExerciseLink to="/basics/01" index="1" name="Basic write" />
            </li>
            <li>
              <ExerciseLink to="/basics/02" index="2" name="Linking data" />
            </li>
            <li>
              <ExerciseLink to="/basics/03" index="3" name="Reading data in links" />
            </li>
          </ul>
        </div>
        <div class="dn db-ns flex-auto tc">
          <img src="./ipfs-illustrations-how-1.svg" alt="">
        </div>
      </div>
    </section>
    <section class="db">
      <div class="flex items-start pv4">
        <div class="section-1 flex-none tc">
          <h1 class="ma0 f3 fw6 pb2">IPLD</h1>
          <img src="./ipld.svg" alt="" style="height: 54px"/>
        </div>
        <div class="w-100 w-50-ns measure-wide ph2 ph0-ns">
          <h2 class="ma0 f3 fw5 ">Blogging on the Decentralized Web</h2>
          <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">
            Cool content addresses don't change.
          </p>
          <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
            <li>
              <ExerciseLink to="/blog/01" index="1" name="Basic linking" />
            </li>
            <li>
              <ExerciseLink to="/blog/02" index="2" name="CIDs change" />
            </li>
            <li>
              <ExerciseLink to="/blog/03" index="3" name="Multiple links" />
            </li>
            <li>
              <ExerciseLink to="/blog/04" index="4" name="Bigger DAG" />
            </li>
            <li>
              <ExerciseLink to="/blog/05" index="5" name="Keep building links" />
            </li>
            <li>
              <ExerciseLink to="/blog/06" index="6" name="Chain of links" />
            </li>
            <li>
              <ExerciseLink to="/blog/07" index="7" name="Hop through nodes" />
            </li>
          </ul>
        </div>
        <div class="dn db-ns flex-auto tc">
          <img src="./ipfs-illustrations-how-4.svg" alt="">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ExerciseLink from './ExerciseLink'

export default {
  name: 'home',
  components: {
    ExerciseLink
  }
}
</script>

<style scoped>
.header-text {
  padding-bottom: 31px;
}
.header-text h1 {
  font-size: 36px;
}
.header-text h2 {
  font-size: 15px;
}
.indent-1 {
  padding-left: 1rem;
}
.section-1 {
  display: none;
}
@media screen and (min-width: 530px) {
  .header-text h1 {
    font-size: 50px;
  }
  .header-text h2 {
    font-size: 21px;
  }
  .indent-1 {
    padding-left: 93px;
  }
  .section-1 {
    display: block;
    width: 93px;
  }
}
</style>
